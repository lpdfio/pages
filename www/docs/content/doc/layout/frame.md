# Frame

An atomic box around a single child, which it centres. A frame will never split across pages — if it doesn't fit on the current page it moves in full to the next, and one taller than a page is cut at the bottom of the page. Use it for callout boxes, cards, and labelled regions. To put several elements in a frame, wrap them in a [`column`](?p=doc/layout/column). A frame takes no `gap`, `align` or `justify`, and a second child is an error.

> To allow contents to flow across pages, use [`column`](?p=doc/layout/column) with `padding` and `background` instead.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `padding`    | spacing | —       | Inner padding: `16pt` or shorthand `"16pt 12pt"` |
| `background` | color or `gradient:name` | — | Background: a color, or a [gradient](?p=xml/schema#gradients) that spans the box |
| `border`     | string  | —       | Border: `"s #cccccc"` or `"1pt #cccccc"` |
| `radius`     | token/pt | —      | Corner radius |
| `color`      | color   | inherit | Color of the text inside. A text that sets none takes the nearest box's. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `opacity`    | 0–1     | `1`     | How opaque the box and everything in it is, as one. See [Opacity](?p=doc/layout#opacity) |
| `shadow`     | string  | —       | A hard-edged shadow under the box: `"x y color"`, with an optional opacity. See [Shadow](?p=doc/layout#shadow) |
| `height`     | token/pt/`fill`/`full` | — | Fixed height: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens) |
| `paginate`   | string           | — | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `width`      | token/pt | —      | Constrain width |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `data-if`    | string  | —       | Render only when value is truthy |
| `data-if-not` | string | —      | Render only when value is falsy |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

## Callout box

```xml
<frame padding="m" background="#fff8e1" border="s #f9a825" radius="s">
  <column gap="4pt">
    <text font-size="s">Note</text>
    <text font-size="xs">This is an important callout.</text>
  </column>
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
