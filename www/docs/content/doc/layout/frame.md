# Frame

An atomic box. A frame will never split across pages — if it doesn't fit on the current page it moves in full to the next. Use it for callout boxes, cards, and labelled regions.

> To allow contents to flow across pages, use [`stack`](?p=doc/layout/stack) with `padding` and `background` instead.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `padding`    | spacing | —       | Inner padding: `16pt` or shorthand `"16pt 12pt"` |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border: `"s #cccccc"` or `"1pt #cccccc"` |
| `radius`     | token/pt | —      | Corner radius |
| `height`     | pt/`fill`/`full` | — | Fixed height |
| `width`      | token/pt | —      | Constrain width |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `data-if`    | string  | —       | Render only when value is truthy |
| `data-if-not` | string | —      | Render only when value is falsy |

## Callout box

```xml
<frame padding="m" background="#fff8e1" border="s #f9a825" radius="s">
  <stack gap="4pt">
    <text font-size="s">Note</text>
    <text font-size="xs">This is an important callout.</text>
  </stack>
</frame>
```

## Conditional frame

```xml
<!-- shown only when customer.isPremium is truthy -->
<frame data-if="customer.isPremium" padding="xs" background="#ffd700" radius="xs">
  <text align="center" font-size="xs">★ Premium Customer</text>
</frame>

<!-- shown only when customer.isPremium is falsy -->
<frame data-if-not="customer.isPremium" padding="xs" background="#f0f0f0" radius="xs">
  <text align="center" font-size="xs">Standard Customer</text>
</frame>
```

## Fixed-height placeholder

```xml
<frame height="120pt" border="xs #e0e0e0">
  <text align="center" color="#aaaaaa">Signature</text>
</frame>
```
