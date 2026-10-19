# Rect

A filled or stroked rectangle in a [layer](?p=doc/layer).

## Attributes

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge (or offset from anchor) |
| `width`        | pt        | —       | **Required.** Width |
| `height`       | pt        | —       | **Required.** Height |
| `anchor`       | string    | —       | Reference point: when set, `x` and `y` are offsets, and the rectangle's matching point is placed there |
| `radius`       | pt        | —       | Corner radius |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the rectangle |
| `stroke`       | color     | —       | Stroke color |
| `stroke-width` | pt        | —       | Stroke width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` |
| `shadow`       | string    | —       | A hard-edged shadow under the rectangle: `"x y color"`, with an optional opacity after the color. See [Shadow](?p=doc/layout#shadow) |

Either `anchor` or both `x` and `y` must be provided. To fade a rectangle, put it in a layer with `opacity`.

## Full-page tinted background (underlay)

A layer before the layout is painted under it.

```xml
<layer page="each" opacity="0.4">
  <rect x="0pt" y="0pt" width="612pt" height="792pt" fill="#f0f4ff"/>
</layer>
```

## Inset border (stroke only)

A rectangle with no `fill` is drawn as an outline. The stroke is centred on the edge, so half of it falls outside the rectangle.

```xml
<layer page="each">
  <!-- inset border 20pt from each edge on letter size -->
  <rect x="20pt" y="20pt" width="572pt" height="752pt"
        stroke="#cccccc" stroke-width="1pt"/>
</layer>
```

## Bar along the top edge

`anchor` places a rectangle against the page, whatever its size.

```xml
<layer page="each">
  <rect anchor="top-left" width="612pt" height="8pt" fill="#1763cf"/>
</layer>
```

## Rounded highlight box

```xml
<rect x="40pt" y="100pt" width="200pt" height="60pt"
      fill="#fff8e1" stroke="#f9a825" stroke-width="1pt" radius="4pt"/>
```
