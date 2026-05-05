# Text

A flow text block. Supports multi-line wrapping, font styling, and inline `span` children for mixed runs.

## Attributes

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `font-size` | token/pt | inherit | `xs` `s` `m` `l` `xl` `xxl` or `14pt` |
| `font`      | string  | inherit | Font name declared in `assets` |
| `color`     | color   | inherit | Text color: `#333333` or a named token |
| `align`     | string  | `left`  | `left` `center` `right` `justify` |
| `width`     | token/pt | —      | Constrain text block width |
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
| `href`         | Makes the span a hyperlink |
| `underline`    | `true` / `false` |
| `strike`       | `true` / `false` |

```xml
<text font-size="m">
  See the <span href="https://lpdf.io" color="#1a73e8" underline="true">documentation</span>
  for full details. Use <span font="Courier">monospace</span> for code.
</text>
```

## Data binding

```xml
<text data-value="customer.name">Fallback name</text>
```

The content of the element is replaced by the bound value at render time. The literal content serves as a fallback placeholder in the XML.
