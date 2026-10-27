# Text

A flow text block. Supports multi-line wrapping, font styling, and inline `span` children for mixed runs.

Text has one set of defaults wherever it is, in the flow and in a [layer](?p=doc/layer/text-at): the document's `font` or Helvetica, 11pt (`m`) and the `text` color. In the flow, a text takes its `font`, `font-size` and `color` from the nearest [box](?p=doc/layout#text-color-in-a-box) that sets them.

## Attributes

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `font-size` | token/pt | inherit, else `m` (11pt) | `xs` `s` `m` `l` `xl` `xxl` or `14pt` |
| `font`      | string  | inherit, else the document's `font`, or `Helvetica` | Font name declared in `assets` |
| `color`     | color   | the nearest box's, else `#1a1a1a` | Text color: `#333333` or a named token. A text that sets none takes the color of the nearest box that sets one, else the `text` color: a color named `text` in `tokens` changes the default. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `align`     | string  | `left`  | `left` `center` `right` `justify`. Not inherited: on a box, `align` places the children |
| `width`     | token/pt | —      | Constrain text block width |
| `line-height` | number or token | `1.2` (`m`) | The distance between lines, as a factor of the font size: a number above 0, or a name from the `line-height` row of `tokens`. See [Line height](#line-height) |
| `max-lines` | integer | —       | The most lines drawn. Only whole lines are drawn, and the rest of the text is dropped. No cap by default: the text wraps whole. See [Capping a text](#capping-a-text) |
| `ellipsis`  | boolean | `false` | End the last line drawn in an ellipsis when `max-lines` drops text. With no `max-lines` it changes nothing |
| `widows`    | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may carry to the top of the next page. See [Widows and orphans](#widows-and-orphans) |
| `orphans`   | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may leave at the bottom of a page |
| `capture`   | string  | —       | Records the words of this text under a name, for a header or a footer to show. See [Running headers](?p=doc/layout#running-headers) |
| `capture-ref` | string | —      | In a `region`: shows what was recorded under the name, as of its page, in place of words of its own |
| `capture-mode` | string | `last` | With `capture-ref`: `first` or `last`, which of the texts captured on the page it shows |
| `capture-fallback` | string | — | With `capture-ref`: what it shows until something has been captured in the section |
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `data-value` | string | —       | Dot-path — replaces text content with bound value |
| `data-if`   | string  | —       | Render only when value is truthy |
| `data-if-not` | string | —     | Render only when value is falsy |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |

## Basic

```xml
<text font-size="24pt">Heading</text>
<text font-size="m" color="#555555">Supporting paragraph text.</text>
```

## Justified body copy

```xml
<text font-size="m" align="justify">
  Long paragraphs of body copy look best with justify alignment.
  The engine handles line breaking automatically.
</text>
```

## Inline spans for mixed styling

Use `span` children to apply different styles within a single text block.

| Span attribute | Description |
|----------------|-------------|
| `font`         | Font name |
| `color`        | Text color |
| `href`         | Makes the span a link: a URL, or `#id` to jump to the [bookmark](?p=doc/layout/bookmark) with that id |
| `underline`    | `true` / `false` |
| `strike`       | `true` / `false` |

```xml
<text font-size="m">
  See the <span href="https://lpdf.io" color="#1a73e8" underline="true">documentation</span>
  for full details. Use <span font="Courier">monospace</span> for code.
</text>
```

### Spaces around a span

A span is joined to the text around it as the XML is written: a space falls between them only where the text has whitespace there. `Total: <span>5</span>` reads "Total: 5", and `$<span>5</span>` reads "$5".

```xml
<column gap="xs">
  <text>Total: <span bold="true">5</span> units</text>
  <text>$<span bold="true">5</span>.00</text>
</column>
```

The strings and spans you give `text` in code are joined the same way, so the space belongs inside the string, as the tabs above show: `'Total: '` reads "Total: 5", and `'Total:'` before the same span reads "Total:5".

A line break and the indentation after it count as one space. A space at the start or end of the text is dropped, and so is one at the start of a span. One at the end of a span separates it from what follows.

### Code in a line

A `code-span` is a span for code: its words in Courier on a light tint. A block of code, which keeps its spaces and lines, is a [`code`](?p=doc/layout/code).

```xml
<text>Run <code-span>cargo test</code-span> before you push.</text>
```

## Footnotes

An `fn` inside a text puts a small raised number in the line and its note at the bottom of the page where the number lands. See [Footnote](?p=doc/layout/footnote).

## Widows and orphans

When a paragraph splits across pages, Lpdf keeps at least two of its lines on each page. A line left alone at the bottom of a page is an orphan, and one carried alone to the top of the next page is a widow.

- When fewer than `orphans` lines fit at the bottom of the page, the whole paragraph moves to the next page.
- When fewer than `widows` lines would go to the next page, lines move there from the first page, so the first page ends earlier.
- `widows="1"` and `orphans="1"` turn this off: the paragraph splits wherever the page ends.
- A paragraph that cannot keep both, even at the top of an empty page, splits where the lines fit.

```xml
<text widows="3" orphans="3">
  A paragraph that never leaves fewer than three of its lines on a page,
  at the bottom of the first page or at the top of the next one.
</text>
```

## Capping a text

A text wraps at the width it has and is never cut: a long name or address makes its line, and in a table its whole row, as tall as it needs. A word, or a styled run, wider than a whole line breaks at the last character that fits, so nothing runs past the box. `max-lines` caps it. Only whole lines are drawn, and the rest of the text is dropped. The lines it drops take no room, so a capped text is only as tall as the lines it keeps.

`ellipsis="true"` ends the last line in dots when text was dropped, shortened to fit the width. Without it the text stops at the end of the last line. On its own, with no `max-lines`, `ellipsis` changes nothing: a text with no cap is never cut, and a word wider than the box is broken at the last character that fits, not cut.

A table with a long name in a cell, kept to two lines:

```xml
<table cols="3fr 1fr" border="xs #e0e0e0">
  <tr>
    <td padding="s">
      <text max-lines="2" ellipsis="true">A product name so long that it would wrap onto a third and a fourth line and make this whole row tall, when two lines are all the table has room for</text>
    </td>
    <td padding="s"><text align="right">19.00</text></td>
  </tr>
  <tr>
    <td padding="s"><text max-lines="2" ellipsis="true">A short name</text></td>
    <td padding="s"><text align="right">4.50</text></td>
  </tr>
</table>
```

A capped text that splits across pages keeps the cap across them: the lines it keeps are never more than `max-lines`.

## Line height

The distance between lines is a factor of the font size: `1.2` by default, so an 11pt text has 13.2pt lines. Give a number above 0, such as `1.5`, or a name from the `line-height` row of [`tokens`](?p=xml/schema#tokens): `xs` is 1.0, `s` 1.1, `m` 1.2, `l` 1.4, `xl` 1.6 and `xxl` 2.0. A text without `line-height` is the same as one with `line-height="m"`.

A text splits across pages by its own line height, so open lines break where the page ends.

```xml
<column gap="m">
  <text line-height="1.6">Open lines, a factor of 1.6: easier to read on a long paragraph, and it takes more room, so a page holds fewer of them.</text>
  <text line-height="xs">Tight lines, the token xs, a factor of 1.0: the lines of this paragraph touch more closely, as in a dense table.</text>
</column>
```

## Data binding

```xml
<text data-value="customer.name">Fallback name</text>
```

The content of the element is replaced by the bound value at render time. The literal content is what renders when no data is passed.
