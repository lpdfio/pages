# Flank

One row where every child keeps its own width except one, which fills the rest. By default the last child fills; set `end="true"` and the first child fills while the others sit at the right. Ideal for label/value rows, invoice lines, and header bars. A flank never splits across pages.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment of children: `start` `center` `end` |
| `end`        | boolean | false   | `false`: the last child fills the rest. `true`: the first child fills, and the others keep their own width at the right |
| `gap`        | token/pt | —      | Minimum gap between left and right items |
| `width`      | token/pt | —      | Constrain width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `data-if`    | string  | —       | Render only when value is truthy |
| `data-if-not` | string | —      | Render only when value is falsy |

## Label / value row

```xml
<flank>
  <text>Subtotal</text>
  <text align="right">$1,200.00</text>
</flank>
```

## Header with logo and date

```xml
<flank align="center">
  <text font-size="20pt">Invoice</text>
  <text align="right" color="#888888">2026-05-04</text>
</flank>
```

## Repeating rows with data binding

```xml
<stack data-source="items" gap="xs">
  <flank>
    <text data-value="description">Item description</text>
    <text data-value="price" align="right">$0.00</text>
  </flank>
</stack>
```
