# Flank

Places one item flush-left and one flush-right. Ideal for label/value rows, invoice lines, and header bars.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment of children: `start` `center` `end` |
| `end`        | boolean | false   | Place first child on the right instead of left |
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
