# Markdown

A `markdown` takes the place of a [layout](?p=doc/layout) in a [section](?p=doc/section) and holds Markdown, which Lpdf sets as a styled, paginated PDF. It is for a body that is written as Markdown, such as release notes, an article or documentation, or that comes from a CMS, a database or a user. The page, the header, the footer and a cover are not Markdown, so they stay in the XML around it.

```xml
<markdown margin="54pt">
  <markdown-content><![CDATA[
    # Release notes

    Version 2 adds *Markdown* to **Lpdf**. See the [docs](https://lpdf.io).

    - Faster layout
    - A `markdown` element

    > A quote, with a bar beside it.
  ]]></markdown-content>
</markdown>
```

A `markdown` holds an optional [`markdown-styles`](#styling), which says how each part looks, and one [`markdown-content`](#where-the-markdown-comes-from), which holds the text. With no styles it looks as rendered Markdown does on a project page: clear steps between the headings, comfortable line spacing, code on a light background, links in a color. The blocks flow down the page and across pages as the content of a layout does.

## Attributes

| Attribute   | Type     | Default | Description |
|-------------|----------|---------|-------------|
| `margin`    | spacing  | `36pt`  | The space between the page edges and the Markdown: one value for all four sides, or two to four in the order top, right, bottom, left. A [layer](?p=doc/layer) draws a header or a footer in it |
| `font`      | string   | the document's | The font of the Markdown, which a rule can change |
| `font-size` | token/pt | `m` (11pt) | The size of its text, which a rule can change |
| `color`     | color    | the `text` token | The color of its text, which a rule can change |
| `gap`       | token/pt | `l` (14pt) | The space between blocks: headings, paragraphs, lists, code, quotes, tables and images |
| `bookmarks` | integer  | `6`     | How many levels of headings are [bookmarks](#headings): `2` keeps the levels 1 and 2, `0` none |
| `debug`     | boolean  | `false` | Draw the outline of each box |

A section holds one `layout` or one `markdown`, not both. Put the Markdown in a section of its own, and a cover or a [table of contents](?p=doc/toc) in sections around it.

## Where the Markdown comes from

`markdown-content` holds the text in one of three ways.

**Inline.** Markdown uses `<` and `&` freely, so write it in a CDATA section. The indent that all its lines share is removed first, so that indenting the XML does not make a code block of it, and an indent beyond that one is part of the Markdown.

**From the data.** `data-value` is a path in the [data](?p=data/binding) to a string that holds the Markdown, as it fills a [`text`](?p=doc/layout/text). The text written inside the element is what a document with no data shows. A path the data lacks leaves the Markdown empty, and a value that is not a string is an error.

```xml
<markdown>
  <markdown-content data-value="body"><![CDATA[
    # The text that shows without data
  ]]></markdown-content>
</markdown>
```

**From code.** The builders take the text as a string, from wherever the program has it: `LMarkdown.content(NoAttr, [body])`. See [In code](#in-code).

## What it turns into

The Markdown is CommonMark, with tables, strikethrough and footnotes. Each part becomes the Lpdf element in the second column, so what that element does, it does here.

| Markdown | Becomes | Note |
|---|---|---|
| `# … ######` | a [text](?p=doc/layout/text) for each of `h1` to `h6`, kept on a page with the block after it | Also a bookmark: see [Headings](#headings) |
| a paragraph | a `text` | `widows` and `orphans` apply as on any text. A word or a run longer than a line breaks at the last character that fits, so nothing runs past the margin or out of a table cell |
| `*em*`, `**strong**`, `~~del~~` | a [span](?p=doc/layout/text#inline-spans-for-mixed-styling) | A built-in font gets its italic and bold face by itself. An embedded font names them: see [Styling](#styling) |
| `` `code` `` | a `code-span` | The code font on a tint |
| `[text](url)`, `[text](#id)` | a span with `href` | `#id` jumps to the heading whose text is that id: see [Headings](#headings) |
| `![alt](name)` | an [image](?p=doc/layout/img) as wide as the page allows | JPEG or PNG: see [Images](#images). The alt text is not kept: there are no tagged PDFs yet |
| `---` | a [divider](?p=doc/layout/divider) | |
| `> quote` | a bar beside the blocks of the quote | The quote splits across pages between its blocks |
| `- item`, `1. item` | a list of items, with a disc, a circle or a square for the level, or the numbers | A number list starts at the number its first item has. Lists nest |
| a fenced or indented block | a [code](?p=doc/layout/code) | It keeps its spaces and lines and wraps what is long. The language of a fence is ignored: there is no highlighting by language |
| a table | a [table](?p=doc/layout/table) with a header row | The columns are `auto`: each takes the width its cells need, and a name that does not fit breaks. A column takes its alignment from the `:---:` row, and the header row repeats on each page |
| `[^1]` | a [footnote](?p=doc/layout/footnote) | A note that holds more than a paragraph is cut down to its words, and a note in a table is an error |
| a line break in a paragraph | a space | A hard break, two spaces or `\`, is a space too |
| front matter | nothing | See [A `.md` file](#a-md-file) |
| `- [ ] task`, a definition list | plain text | They are not read as such |
| raw HTML | an error | It names the line: see [Errors](#errors) |
| a `$` | text | `$5` and `$1M—$10M` are drawn as written: there is no math |

## Headings

A heading is a [bookmark](?p=doc/layout/bookmark), so the viewer's outline and a [table of contents](?p=doc/toc) fill themselves, with the level of the heading. `bookmarks` says how many levels count: `bookmarks="2"` leaves the third level and below out of the outline.

The id of a heading is made from its text as a bookmark's is: lowercase, with every run of other characters than letters and digits made one hyphen, and `-2`, `-3` added when an earlier bookmark has it. `# 3.1 Methods` is `3-1-methods`, so `[the methods](#3-1-methods)` links to it. A link to a heading that is not a bookmark, because `bookmarks` leaves it out, goes nowhere.

A running header that shows the heading of the page needs `capture-ref` on a layer's `text-at`, which Lpdf does not have yet. A header and a footer can show the page number and fixed words.

## Headers and footers

A markdown has no region. Its `margin` reserves the space, and a [layer](?p=doc/layer) draws in it, under the Markdown if it comes before it, over it if it comes after. `{page}` and `{pages}` and `data-value` work in a layer's `text-at`.

```xml
<section>
  <layer>
    <rect x="0pt" y="0pt" width="595pt" height="10pt" fill="primary"/>
    <text-at anchor="bottom-center" y="-24pt" font-size="xs" color="text-muted">Page {page} of {pages}</text-at>
  </layer>
  <markdown margin="54pt 54pt 60pt 54pt" gap="m">
    <markdown-content><![CDATA[
      # Quarterly report

      The page number is a layer, drawn in the margin the Markdown leaves.
    ]]></markdown-content>
  </markdown>
</section>
```

## Styling

A rule is an element named after the Markdown it styles, and it takes the attributes of the Lpdf element it becomes. The rules go in `markdown-styles`, so `h1` and `p` mean nothing anywhere else.

```xml
<markdown gap="m">
  <markdown-styles>
    <h1 font-size="xxl" color="primary"/>
    <h2 font-size="xl"/>
    <p align="justify" line-height="1.5"/>
    <quote bar-color="primary" bar-width="4pt" background="surface-alt"/>
    <li bullet="square" gap="s"/>
    <a underline="false"/>
  </markdown-styles>
  <markdown-content><![CDATA[
    # A heading in blue

    A paragraph with a [link](https://lpdf.io) in it.

    - A square bullet
    - Another
  ]]></markdown-content>
</markdown>
```

Values are the [tokens](?p=xml/elements#tokens) (`font-size="xxl"`, `color="primary"`) or plain lengths and colors, and fonts are names from `assets`. An attribute a rule does not set stays as it was: the rules written here are laid over the rules of a file and the defaults one attribute at a time, so `<h1 color="primary"/>` changes the color and nothing else of a heading.

| Rule | Styles | Attributes |
|---|---|---|
| `h1` to `h6`, `p` | the words of a heading and of a paragraph, and of a list item, a quote and a table cell where they hold paragraphs | `font` `font-size` `bold` `color` `align` `line-height`, and for the box around them `padding` `background` `border` `radius` |
| `code` | a block of code, and a run of code in a line | `font` `font-size` `color` `line-height` `tab-size`, and `padding` `background` `border` `radius` of the box. A run takes `font`, `color` and `background` |
| `quote` | a block quote | The words: `font` `font-size` `bold` `color` `align` `line-height`. The box: `padding` `background` `border` `radius`. The bar: `bar-color` and `bar-width`, a length or a token of the space row |
| `li` | a list and its items | `indent`, `bullet` (a bullet list's only) and `gap` of the list, `padding` `background` `border` of an item, and `font` `font-size` `color` of its words |
| `a`, `strong`, `em`, `del` | a link, strong text, emphasis, struck-through text | `font` `color`, and `underline` and `bold` for a link, `bold` for strong text, `strike` for struck-through text |
| `table` | a table | `border` `stripe` `gap` `padding` `background` |
| `th`, `td` | a cell of the header row, a cell of the others | `font` `font-size` `bold` `color` `align` `padding` `background` `border` |

A rule that is not one of these, or an attribute it does not take, is an error that names it, and so is a value that does not read.

**Characters a built-in font has not got.** A built-in font draws the Windows-1252 characters. For the lines and corners of a box it draws `-`, `|` and `+`, for the arrows `>`, `<`, `^` and `v`, and for the other characters it has not got, such as `✓` or `日本`, a `?`. A document that needs them as they are sets the `font` of the rule, `code` for a diagram, to an embedded font that has them.

**Italic and bold in an embedded font are fonts.** A span has `bold` but no italic, and `bold` picks the bold face of a built-in font only. A document that sets the Markdown in an embedded font names the faces:

```xml
<markdown font="body">
  <markdown-styles>
    <em font="body-italic"/>
    <strong font="body-bold"/>
  </markdown-styles>
  <markdown-content>Words in *italic* and **bold**.</markdown-content>
</markdown>
```

### Rules in a file

`src` on `markdown-styles` names a file whose root is a `markdown-styles`. Its rules sit between the defaults and the rules written inline, which override them, so one file can serve every Markdown a template renders, and a template points its rules at token names, so that a token file restyles them all.

```xml
<markdown-styles src="styles/markdown-styles.xml">
  <h1 color="primary"/>
</markdown-styles>
```

The engine reads no files: the SDK, the command line or the extension reads the `src`, as it reads the `src` of a font or an image, and a file it cannot read is an error that names the `src`.

### The defaults

The defaults are rules like any other, written with token names, so that a token file alone rebrands them. The engine carries them, so a `markdown` with no styles renders the same in every SDK. `markdown-styles.xml` in the core's repository is the file, and **Lpdf: Write Markdown Styles** in VS Code writes a copy beside a `.md` file to start from.

## Images

An image of the Markdown names an [asset](?p=doc/layout/img) in the way it is written: by its `name`, or by its `src`. Declaring `<image name="photo" src="img/photo.png"/>` answers `![](photo)` and `![](img/photo.png)`, so a `.md` file can keep the relative paths it has everywhere else. An image that is neither is an error that names the line, and so is one at a URL: Lpdf does not download. The image is as wide as the page allows and as tall as its proportions make it.

```xml
<lpdf version="1">
  <assets>
    <image name="photo" src="img/photo.png"/>
  </assets>
  <document>
    <section>
      <markdown>
        <markdown-content><![CDATA[
          ![The photo of the quarter](img/photo.png)
        ]]></markdown-content>
      </markdown>
    </section>
  </document>
</lpdf>
```

## A `.md` file

A `.md` file is wrapped in a template: a document with a `markdown` that reads its text from the data `markdown`, which the file's front matter goes with. The VS Code extension and the command line do it the same way.

- A YAML block at the top of the file, from `---` to `---`, is not drawn. Its `key: value` lines are data beside the text, so a template can show them: `<text-at data-value="title">`. A value that is not on the line, a list and a nested field are left out.
- A relative image is declared in the template as an asset, read relative to the `.md` file.
- With no template of its own, the file is set on an A4 page with a margin of 54pt and the page number at the foot.

```
lpdf convert --input notes.md --output notes.pdf
lpdf convert --input notes.md --template markdown-template.xml --output notes.pdf
```

`--template` is a document like the one below, with `--data` adding fields to those of the front matter.

```xml
<lpdf version="1">
  <document size="a4">
    <section>
      <layer>
        <text-at anchor="bottom-center" y="-24pt" font-size="xs" color="text-muted">Page {page} of {pages}</text-at>
      </layer>
      <markdown margin="54pt">
        <markdown-styles src="markdown-styles.xml"/>
        <markdown-content data-value="markdown"/>
      </markdown>
    </section>
  </document>
</lpdf>
```

In VS Code, **Lpdf: Preview PDF** on a `.md` file in the Explorer, or the button in the editor's title bar, shows it beside the file. **Lpdf: Link Markdown Styles...** links a file of styles to it, and **Lpdf: Write Markdown Styles** writes the default ones beside it to start from. **Lpdf: Create Lpdf Document** writes a document like the one above, named after the file, and links it: the file is then set in that document, where the page size, the margin, a header and a footer are yours. The other way round, **Lpdf: Link Markdown File...** on a document with a `markdown` makes a `.md` file its body. The preview follows an edit of the Markdown, the document, the styles file and an image.

## Errors

The Markdown is read strictly, because it is in the hands of whoever renders it, and a mistake is an error that names the line of the Markdown and what to write instead. An application that renders Markdown of its users catches the error and shows it.

```
markdown line 12: an image's source must be the name or the src of an asset: 'missing.png' is neither
markdown line 31: raw HTML is not supported: write the Markdown it stands for, or leave it out
markdown line 5: the footnote [^2] has no definition; define it with [^2]: and its words, or write \[ to show it as text
```

## In code

The builders have a `markdown` that holds `styles` and `content`, and the rules are `LMarkdown.h1()`, `LMarkdown.quote()` and so on, in the language's case. A builder has no data binding, so the text is a string the program passes in. In Python the rule of struck-through text is `LMarkdown.del_`, since `del` is a keyword.

```js
import { L, LMarkdown, NoAttr } from '@lpdfio/lpdf'

const document = L.document(NoAttr, [
  L.section(NoAttr, [
    L.markdown({ margin: '54pt', gap: 'm' }, [
      LMarkdown.styles({ src: 'markdown-styles.xml' }, [LMarkdown.h1({ color: 'primary' })]),
      LMarkdown.content(NoAttr, [body]),
    ]),
  ]),
])
```
