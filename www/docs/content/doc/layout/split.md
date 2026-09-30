# Split

Two children side by side. By default each keeps its own width, the first at the left edge and the second at the right. Set `equal="true"` and they take half the width each. Any further children are ignored. A split never splits across pages.

For three or more columns, use [`grid`](?p=doc/layout/grid). For explicit column widths, use [`table`](?p=doc/layout/table).

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment of the two children: `start` `center` `end` |
| `equal`      | boolean | false   | `false`: each child keeps its own width, pushed to opposite edges. `true`: the two children take half the width each |
| `gap`        | token/pt | —      | Gap between the two children; the minimum gap when `equal` is false |
| `width`      | token/pt | —      | Constrain total width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |

## Two equal columns

```xml
<split equal="true" gap="24pt">
  <stack gap="8pt">
    <text font-size="s">Bill To</text>
    <text>Acme Inc</text>
    <text>123 Main St</text>
  </stack>
  <stack gap="8pt">
    <text font-size="s">Ship To</text>
    <text>Acme Inc</text>
    <text>456 Depot Ave</text>
  </stack>
</split>
```

## Opposite edges

```xml
<split align="center">
  <text font-size="20pt">Invoice</text>
  <text color="#888888">2026-05-04</text>
</split>
```
