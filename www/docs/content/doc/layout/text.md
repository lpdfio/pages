# Text

A flow text block. Supports multi-line wrapping, font styling, and inline `span` children for mixed runs.

Text has one set of defaults wherever it is, in the flow and in a [layer](?p=doc/layer/text-at): the document's `font` or Helvetica, 11pt (`m`) and the `text` color.

## Attributes

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `font-size` | token/pt | inherit, else `m` (11pt) | `xs` `s` `m` `l` `xl` `xxl` or `14pt` |
| `font`      | string  | inherit, else the document's `font`, or `Helvetica` | Font name declared in `assets` |
| `color`     | color   | `#1a1a1a` | Text color: `#333333` or a named token. Not inherited: a color named `text` in `tokens` changes the default |
| `align`     | string  | `left`  | `left` `center` `right` `justify` |
| `width`     | token/pt | —      | Constrain text block width |
| `widows`    | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may carry to the top of the next page. See [Widows and orphans](#widows-and-orphans) |
| `orphans`   | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may leave at the bottom of a page |
| `paginate`  | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `data-value` | string | —       | Dot-path — replaces text content with bound value |
| `data-if`   | string  | —       | Render only when value is truthy |
| `data-if-not` | string | —     | Render only when value is falsy |

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

## Data binding

```xml
<text data-value="customer.name">Fallback name</text>
```

The content of the element is replaced by the bound value at render time. The literal content is what renders when no data is passed.
