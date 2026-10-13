# Text

A flow text block. Supports multi-line wrapping, font styling, and inline `span` children for mixed runs.

## Attributes

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `font-size` | token/pt | inherit | `xs` `s` `m` `l` `xl` `xxl` or `14pt` |
| `font`      | string  | inherit | Font name declared in `assets` |
| `color`     | color   | `#1a1a1a` | Text color: `#333333` or a named token. Not inherited: a color named `text` in `tokens` changes the default |
| `align`     | string  | `left`  | `left` `center` `right` `justify` |
| `width`     | token/pt | —      | Constrain text block width |
| `widows`    | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may carry to the top of the next page. See [Widows and orphans](#widows-and-orphans) |
| `orphans`   | integer | `2`     | The fewest lines, 1 to 10, that a split paragraph may leave at the bottom of a page |
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
