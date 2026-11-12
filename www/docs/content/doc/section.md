# Section

A `section` is a run of pages inside a document. Each section paginates on its own: its content starts on a new page and continues onto as many pages as it needs. A document can have several sections with different page sizes or orientations. The page numbers count on from one section to the next: see [Page numbers](#page-numbers).

## Attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `size`        | string  | inherit | Page size override: `letter`, `legal`, `a3`, `a4`, `a5`, or a custom `"200pt 300pt"` |
| `orientation` | string  | inherit | `portrait` or `landscape` |
| `background`  | color   | inherit | Page background color |
| `ruling`      | string  | —       | Draws a [ruling](?p=xml/schema#rulings) of the tokens on every page. See [Ruled and squared pages](#ruled-and-squared-pages) |
| `footnote-counter` | string | inherit | Where the numbers of the [footnotes](?p=doc/layout/footnote) in this section start over: `page`, `section` or `document`. Overrides the document's |
| `title`       | string  | —       | Section title. Accepted, but not used: the PDF's outline takes its entries from [bookmarks](?p=doc/layout/bookmark) |
| `type`        | string  | —       | `toc` makes the section the document's [table of contents](?p=doc/toc) |
| `toc-indent-step` | token/length | `12pt` | In a table of contents, the indent for each level below the first |
| `page-start`  | whole number | — | The number of the section's first page, which starts a new run of pages: `1` restarts the count. 1 or more. See [Page numbers](#page-numbers) |
| `page-format` | string  | the section before's | How the page numbers are written: `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman` or `upper-roman`. The first section's are decimal |
| `page-prefix` | string  | the section before's | Text before the page numbers, such as `A-`. `""` takes it away |
| `columns`     | whole number | 1 | Sets the flow in this many columns, from 1 to 12. See [Columns](#columns) |
| `column-gap`  | token/length | `l`    | The space between two columns, as `gap` takes it |
| `column-rule` | border  | —       | A line in the middle of each gap, as `border` takes it: `0.5pt #cccccc` |
| `column-fill` | string  | `auto`  | How the columns of the last page fill: `auto`, in order, or `balance`, levelled. CSS's default is `balance` |
| `debug`       | boolean | false   | Render layout boxes for debugging |

All attributes are optional. The page settings inherit from `document` when not set.

A section holds [layers](?p=doc/layer) and at most one [`layout`](?p=doc/layout) or one [`markdown`](?p=doc/markdown), painted in the order they are written: a layer before the layout is painted under it, and a layer after it is painted over it. A section with neither is one page. Before them it can hold one [`bookmark`](?p=doc/layout/bookmark), which marks the section's first page.

The margin is not a page setting: it belongs to the layout, which is the content that keeps to it. See [`layout`](?p=doc/layout#margin).

Content always goes in a `section`. A `layout` placed directly inside `document` is an error.

## Layers and a layout

A section holds any number of [layers](?p=doc/layer) and at most one layout. They are painted in the order they are written, so each one is drawn over the ones before it. The layout creates as many pages as its content needs, and a layer is drawn on the pages its `page` selects.

```xml
<section>
  <bookmark label="Invoice"/>
  <layer>
    <!-- under the layout: the letterhead -->
    <rect x="0pt" y="0pt" width="612pt" height="12pt" fill="#1763cf"/>
  </layer>
  <layout margin="48pt">
    <text font-size="xl">Invoice</text>
  </layout>
  <layer page="each">
    <!-- over the layout, on every page -->
    <text-at anchor="bottom-right" x="-48pt" y="-24pt" font-size="9pt">Page {page} of {pages}</text-at>
  </layer>
  <layer page="last">
    <!-- over the layout and the layer before it, on the last page -->
    <line x1="48pt" y1="700pt" x2="248pt" y2="700pt" stroke="#333333"/>
    <text-at x="48pt" y="704pt" font-size="8pt">Signature</text-at>
  </layer>
</section>
```

A section with only layers is one page, such as a cover. A second `layout` in a section is an error, and a layer cannot go inside the layout. A `markdown` takes the place of the layout, for a section whose content is Markdown: a section has one or the other.

## Multiple sections

```xml
<document size="letter">
  <section>
    <layout margin="48pt">
      <text font-size="14pt">First page</text>
    </layout>
  </section>
  <section>
    <layout margin="48pt">
      <text font-size="14pt">Second page</text>
    </layout>
  </section>
</document>
```

## Mixed page sizes

```xml
<document>
  <section size="letter">
    <layout margin="48pt">
      <text>Letter page content</text>
    </layout>
  </section>
  <section size="a4">
    <layout margin="40pt">
      <text>A4 page content</text>
    </layout>
  </section>
</document>
```

## Landscape section

```xml
<section size="letter" orientation="landscape">
  <layout margin="72pt">
    <text font-size="18pt">Wide page content</text>
  </layout>
</section>
```

## Columns

`columns` sets the section's flow in columns: a long text, or a long list of short items, runs down the first column, carries on at the top of the next, and goes on to the next page after the last. Each column fills like a small page, so what comes from data lays itself out: a glossary, a price list, a directory, terms and conditions in small print, a newsletter. It works the same for a `layout` and a [`markdown`](?p=doc/markdown), since both are the section's flow. Headers and footers ([regions](?p=doc/layout#pinned-regions) pinned to the top or the bottom), the notes of [footnotes](?p=doc/layout/footnote) and [layers](?p=doc/layer) keep the full width of the page.

```xml
<document size="a4">
  <section columns="3" column-gap="m" column-rule="0.5pt #c5ccd6">
    <layout margin="40pt">
      <region pin="top">
        <text font-size="xxl" font="Times-Bold">The Harbour Gazette</text>
      </region>
      <region pin="bottom">
        <text font-size="s" align="center">Page {page} of {pages}</text>
      </region>
      <text font-size="l" font="Helvetica-Bold">The lamp-keepers' record</text>
      <text align="justify">The lamp-keepers of the northern coast kept a record of every evening they lit the harbour light, and the record grew longer than the harbour itself. Each entry gives the hour, the weather and the ships that passed before midnight.</text>
      <text align="justify">The oldest keeper claimed that she could tell the season from the smell of the oil alone, and she was seldom wrong. When a storm did come, the entries ran past the margin and onto the back of the page.</text>
      <text font-size="l" font="Helvetica-Bold" paginate="break-before">The new light</text>
      <text align="justify">When the board sent the new lens, it came in eleven crates and a letter of instructions longer than the record of that year.</text>
    </layout>
  </section>
</document>
```

- **`column-gap`** is the space between two columns, a space token or a length, as `gap` takes it. It defaults to `l`, so the text of two columns never runs together, and follows a theme that changes the spacing scale.
- **`column-rule`** draws a line in the middle of each gap, as `border` takes it: a thickness and a color. It runs from the top of the columns to the foot of the tallest one on the page, and only between two columns that hold something: three columns with content for two get one line.
- **`column-fill`** says how the columns of the last page fill. `auto`, the default, fills them in order, as on every other page, so the last column can be short or empty. `balance` levels them: the columns are as short as they can be and still hold the rest. A node that isn't cut, such as an image, moves whole to the next column, so balanced columns can end a little uneven. CSS's `column-fill` defaults to `balance`; Lpdf's defaults to `auto`, and balances only when asked.
- `column-gap`, `column-rule` and `column-fill` are ignored when `columns` is missing or 1, which is a section as it always was.

What ends a page in one column ends a column in several: [`paginate="break-before"`](?p=doc/layout#page-breaks) moves its element to the top of the next column, and `break-after` and `keep-next` act per column. A new page is a new section. A text splits between its lines from one column to the next, a table between its rows, with its header row at the top of each column it is in, and a node taller than an empty column is placed anyway and cut at its foot, as on a page. An image with `width="fill"` takes the column's width, and one with a fixed width wider than a column runs over the gap into the next. The notes of the footnotes go at the foot of the page, under all the columns, numbered in reading order, column by column.

Lpdf doesn't hyphenate words on its own, so justified text in a narrow column can show wide gaps between them. Put [soft hyphens](?p=doc/layout/text#breaking-a-word-at-a-soft-hyphen) in its long words, where lines may break, or set columns under about forty characters left-aligned.

### Insets

An inset is a block at a spot inside the columns that the flow goes around: a picture across two columns of a newsletter, a quote, a box of opening hours. It is a [`region`](?p=doc/layout#pinned-regions) with `pin="inset"`, written in the layout, and holds what any region holds. The columns it covers fill above it and carry on below it; the others run straight down.

```xml
<document size="a4">
  <section columns="4" column-gap="m" column-rule="0.5pt #c5ccd6">
    <layout margin="36pt">
      <region pin="inset" col="2" colspan="2" top="110pt" height="210pt">
        <column background="#eef3fb" padding="m" gap="xs" height="fill">
          <text font-size="l" font="Times-Italic" align="center">"Kept to the end."</text>
          <text font-size="s" align="center">The last line of the record, in the daughter's hand.</text>
        </column>
      </region>
      <text align="justify">The lamp-keepers of the northern coast kept a record of every evening they lit the harbour light, and the record grew longer than the harbour itself. Each entry gives the hour, the weather and the ships that passed before midnight. Most nights the third column stayed empty, and the keepers took pride in that.</text>
      <text align="justify">The oldest keeper claimed that she could tell the season from the smell of the oil alone, and she was seldom wrong. Nobody could say when the first entry was made, only that the ink in it had faded to the color of weak tea.</text>
      <text align="justify">Under the lamp room stood a cupboard of spare wicks, glass chimneys and one brass bell that nobody remembered buying. A page of the record was ruled into three columns: the hour, the weather, and a line for anything worth remembering.</text>
      <text align="justify">In the winter of the great storm the record runs to four pages for a single night. The oil came by boat in spring and autumn, and a late boat meant a careful winter. A keeper's daughter wrote the entries for six years when her father's hands failed.</text>
    </layout>
  </section>
</document>
```

| Attribute | Default | Description |
|-----------|---------|-------------|
| `top`     | —       | **Required.** How far below the top of the columns the inset starts, under the headers: `110pt`, `40mm` |
| `height`  | —       | **Required.** How tall it is. Content taller than it is clipped at its foot |
| `col`     | 1       | The column it starts in, counted from 1 at the left |
| `colspan` | 1       | How many columns it covers, from `col`. It is as wide as those columns and the gaps between them |
| `page`    | `each`  | The pages it is on, as for any region: `each`, `first`, `last`, `odd`, `even`, or a range such as `2-last` |

- **It is never cut.** An inset whose `top` and `height` reach below the room the headers and footers leave, on a page it is on, is an error, which shows the first time the template is tried. A `col` and `colspan` that run past the section's `columns` are an error, and so are `col`, `colspan`, `top` and `height` on a region pinned to an edge.
- **The notes of footnotes give way to it.** They don't rise above the foot of an inset: a line whose note would need them to goes on to the next page, with its note.
- **`page="last"`** puts the inset on the last page of the flow filled without it. That page is filled again with it, and if text no longer fits, the text goes on to a new page with no inset, and the inset stays where it was, one page before the end. No error: a template that worked for months doesn't fail on a longer list.
- A layout can hold several insets. Two that overlap each keep the flow out of their own rectangle, and are drawn in the order they are written. An inset needs no columns: in a section of one, it is a block the text goes around.

## Ruled and squared pages

`ruling` draws the lines of a ruling on every page of the section: ruled paper to write on, squared paper to draw on, or a grid to place things by while editing. The ruling is defined once in the [tokens](?p=xml/schema#rulings), and any number of sections name it. Its lines go under the section's layers and its layout, over its background, and stop at the trim edge.

```xml
<lpdf version="1">
  <tokens>
    <rulings>
      <!-- squares of 5mm from the corner of the page -->
      <ruling name="squares">
        <lines step="5mm"/>
      </ruling>
      <!-- the area inside the margin cut into 12 columns and 16 rows, shown on screen and not printed -->
      <ruling name="grid" origin="margin" ocg="screen">
        <lines count-x="12" count-y="16" color="#f2b8b8" thickness="0.25pt"/>
      </ruling>
    </rulings>
  </tokens>
  <document size="a4">
    <section ruling="squares">
      <layout margin="40pt">
        <text font-size="l">Squared paper</text>
      </layout>
    </section>
    <section ruling="grid">
      <layout margin="60pt">
        <text font-size="l">Placed by the grid</text>
      </layout>
    </section>
  </document>
</lpdf>
```

A step keeps its size on a page of any size, and a count its number of parts. With `origin="margin"` the lines fill the area inside the margin of the section's `layout` or `markdown`, and ignore its `columns`. A section that holds only a ruling, `<section ruling="squares"/>`, is one page of paper.

## Bookmarking a section

A bookmark as the section's first child adds its first page to the PDF's outline, the bookmarks panel of a viewer. A section's `title` adds no entry.

```xml
<document size="a4">
  <section>
    <bookmark label="Introduction"/>
    <layout margin="48pt">
      <text font-size="20pt">Introduction</text>
    </layout>
  </section>
  <section>
    <bookmark label="Results"/>
    <layout margin="48pt">
      <text font-size="20pt">Results</text>
    </layout>
  </section>
</document>
```

## Page numbers

A document's pages count on from one section to the next, from 1, in decimal. `{page}` in a [region](?p=doc/layout#pinned-regions) or a layer's [`text-at`](?p=doc/layer/text-at#page-numbers) prints the page's number, and `{pages}` how many pages its run has. A section changes the count only when it says so:

- **`page-start`** starts a new run at the section's first page, from the number it gives. `page-start="1"` restarts the count. A number above 1 continues a count from outside the file, such as volume 2 from page 321.
- **`page-format`** writes the numbers in `decimal` (1, 2, 3), `lower-alpha` (a, b, c), `upper-alpha` (A, B, C), `lower-roman` (i, ii, iii) or `upper-roman` (I, II, III). A new format doesn't restart the count: `page-start` does.
- **`page-prefix`** puts text before the number: `page-prefix="A-"` writes A-1, A-2.

A section that sets none of the three carries on the count, the format and the prefix of the section before. A book numbers its front matter in roman numerals from the cover, its chapters from 1 and its appendix from A-1:

```xml
<document size="a5">
  <section page-format="lower-roman">
    <layout margin="48pt">
      <text font-size="xl">The Lamplighter's Almanac</text>
      <text paginate="break-before">This page is left blank.</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section>
    <layout margin="48pt">
      <text font-size="xl">Preface</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section page-start="1" page-format="decimal">
    <layout margin="48pt">
      <text font-size="xl">Chapter 1</text>
      <text paginate="break-before">The chapter goes on.</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section page-start="1" page-prefix="A-">
    <layout margin="48pt">
      <text font-size="xl">Appendix</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
</document>
```

The cover and its back say "Page i of iii" and "Page ii of iii", the preface "Page iii of iii", the chapter "Page 1 of 2" and "Page 2 of 2", and the appendix "Page A-1 of 1".

- **`{pages}`** counts the pages of a run, from one `page-start` to the next, or to the end of the document. It is written in the run's format and without the prefix, since it is a count and not a page. A file of invoices sets `page-start="1"` on each section, and each invoice says "Page 1 of 2" and "Page 2 of 2".
- **The table of contents, cross-references and the viewer** show the same numbers. A [table of contents](?p=doc/toc) prints the number each entry's page prints, and so does a [cross-reference](?p=doc/layout/bookmark#referring-to-a-bookmark) for the page of its bookmark. The PDF labels its pages with them, so the page box of a viewer shows ii or A-1, and a reader who types A-1 there goes to that page. A document whose sections set none of the three has no labels: a viewer counts 1, 2, 3 without them.
- **Odd and even pages** follow the same numbers: a region or a layer with `page="odd"` or `page="even"` shows on the pages whose printed number is odd or even, so a section that starts on page 4 shows its even header on its first page. `first`, `last` and ranges count the section's own pages. See [Odd and even pages](?p=doc/layout#odd-and-even-pages).
- **Letters past z** repeat one letter, aa, bb, cc, as PDF viewers count pages, where the letters of a [list](?p=doc/layout/list) go aa, ab, ac. A number past 3999 in letters or numerals is written in decimal.

## Table of contents

A section with `type="toc"` lists the document's bookmarks with their page numbers. It is laid out after the other sections, and a document can have one. See [Table of Contents](?p=doc/toc).
