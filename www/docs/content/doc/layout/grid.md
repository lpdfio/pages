# Grid

A multi-column grid. Children fill columns left-to-right and wrap to new rows. Grid rows are atomic — a row will not split across pages.

Use grid for uniform card layouts. For tabular data with column headers, use [`table`](?p=doc/layout/table) instead.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `cols`       | integer | —       | Number of columns (1–12) |
| `col-width`  | token/pt | —      | Fixed column width (overrides `cols`) |
| `gap`        | token/pt | —      | Gap between cells |
| `width`      | token/pt | —      | Constrain total width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `data-source` | string | —       | Dot-path to array — repeats children per item |

## Three-column layout

```xml
<grid cols="3" gap="m">
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <stack gap="4pt">
      <text font-size="s">Feature A</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </stack>
  </frame>
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <stack gap="4pt">
      <text font-size="s">Feature B</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </stack>
  </frame>
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <stack gap="4pt">
      <text font-size="s">Feature C</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </stack>
  </frame>
</grid>
```

## Data-driven grid

```xml
<grid cols="2" gap="m" data-source="products">
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <stack gap="4pt">
      <text font-size="s" data-value="name">Product name</text>
      <text font-size="xs" color="#666666" data-value="price">$0.00</text>
    </stack>
  </frame>
</grid>
```
