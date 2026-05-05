# Split

Divides available width equally between its children. Use `equal="false"` for the first child to take only its natural width and the rest to share the remainder.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment: `start` `center` `end` |
| `equal`      | boolean | true    | Equal-width columns; `false` lets first child size naturally |
| `cols`       | string  | —       | Custom column widths: `"1fr 2fr"` or `"200pt 1fr"` (overrides `equal`) |
| `gap`        | token/pt | —      | Gap between columns |
| `width`      | token/pt | —      | Constrain total width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |

## Two equal columns

```xml
<split gap="24pt">
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

## Three columns

```xml
<split gap="16pt">
  <text align="center">Column A</text>
  <text align="center">Column B</text>
  <text align="center">Column C</text>
</split>
```
