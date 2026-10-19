# Circle / Ellipse

`circle` draws a circle, and `ellipse` an ellipse with separate x and y radii, in a [layer](?p=doc/layer). Both are placed by their box, like a [`rect`](?p=doc/layer/rect).

## `circle` attributes

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x`            | signed pt | —       | X of the left edge of the circle's box (or offset from anchor) |
| `y`            | signed pt | —       | Y of the top edge of the circle's box (or offset from anchor) |
| `r`            | pt        | —       | **Required.** Radius |
| `anchor`       | string    | —       | Reference point: when set, `x` and `y` are offsets, and the box's matching point is placed there |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the circle's box |
| `stroke`       | color     | —       | Stroke color |
| `stroke-width` | pt        | —       | Stroke width |
| `stroke-dash`  | string    | —       | Dash pattern |
| `shadow`       | string    | —       | A hard-edged shadow under the circle: `"x y color"`, with an optional opacity after the color. See [Shadow](?p=doc/layout#shadow) |

## `ellipse` attributes

Same as `circle` except `r` is replaced by:

| Attribute | Type | Description |
|-----------|------|-------------|
| `rx`      | pt   | **Required.** Horizontal radius |
| `ry`      | pt   | **Required.** Vertical radius |

## The box

The box of a circle is the square of side `2r` around it, and the box of an ellipse is `2rx` wide and `2ry` high. `x` and `y` place the box, so the centre is `r` further in: a circle with `x="0pt" y="0pt"` and `r="40pt"` touches the top left corner of the page, and is wholly on it.

To centre a circle on a point, subtract the radius: a circle of `r="40pt"` centred on 100pt, 100pt is `x="60pt" y="60pt"`.

With `anchor`, the box's matching point is placed on the anchor point, as for any other element. `anchor="bottom-right"` puts the circle's box in the bottom-right corner of the page.

Either `anchor` or both `x` and `y` must be provided. A stroke is centred on the edge, so half of `stroke-width` falls outside the box. To fade a circle, put it in a layer with `opacity`.

## Circle

```xml
<layer opacity="0.8">
  <circle x="60pt" y="60pt" r="40pt" fill="#1a73e8"/>
</layer>
```

## Hollow circle (stroke only)

```xml
<circle x="106pt" y="196pt" r="200pt" stroke="#e0e0e0" stroke-width="1pt"/>
```

## Ellipse anchored to the page centre

```xml
<layer opacity="0.5">
  <ellipse anchor="center" rx="150pt" ry="80pt" fill="#f0f4ff"/>
</layer>
```
