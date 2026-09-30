# Canvas

`canvas` provides absolute positioning within a `section`. Use it for watermarks, stamps, page headers/footers, decorative borders, and any element that must sit at an exact position independent of the flow layout.

## Structure

All canvas primitives must be inside a `layer`. Bare primitives directly in `canvas` are not valid.

```xml
<section>
  <layout>
    <text>Main content</text>
  </layout>
  <canvas>
    <layer page="each">
      <text x="0pt" y="756pt" font-size="9pt" color="#aaaaaa">Page footer</text>
    </layer>
  </canvas>
</section>
```

## Paint order (overlay vs underlay)

The element listed first in `section` is painted first:

```xml
<!-- canvas as underlay (behind layout) -->
<section>
  <canvas>…</canvas>
  <layout>…</layout>
</section>

<!-- canvas as overlay (in front of layout) -->
<section>
  <layout>…</layout>
  <canvas>…</canvas>
</section>
```

## `layer` attributes

| Attribute   | Type    | Default | Description |
|-------------|---------|---------|-------------|
| `page`      | string  | `each`  | Which pages to render on: `each` `first` `last` `odd` `even`, or numbers and ranges such as `1`, `2-last` or `1,3-5` |
| `opacity`   | 0–1     | 1       | Layer-wide opacity |
| `transform` | string  | —       | Transform applied to everything in the layer; see below |
| `clip`      | string  | —       | Reserved. It is accepted but has no effect yet |

A layer cannot contain another layer. To combine opacity and a transform, put both on one layer.

### Transforms

| Form | Effect |
|------|--------|
| `translate(x, y)` | Move by `x` and `y` |
| `scale(s)` or `scale(sx, sy)` | Scale by `s`, or by `sx` across and `sy` down |
| `rotate(deg, cx, cy)` | Rotate by `deg` degrees around the point `cx`, `cy` |
| `matrix(a, b, c, d, e, f)` | A full transform matrix |

The numbers are plain numbers in points, separated by commas or spaces. A number with a unit, such as `translate(10pt 20pt)`, is not read, and the transform does nothing.

## Coordinate system

- Origin: **top-left** of the full page (ignores margin)
- Y axis: **downward** (y=0 is top of page)
- Units: `pt`, `mm`, `in` (negative values allowed for offsets from anchors)

## Positioning with `anchor`

Instead of x/y coordinates, use `anchor` to reference one of nine points on the page. `x` and `y` become signed offsets from that point. The element is placed so its own matching point lands there: `anchor="bottom-right"` puts the element's bottom-right corner on the page's bottom-right corner, before the offset.

| Anchor values | |
|---|---|
| `top-left` `top-center` `top-right` | |
| `center-left` `center` `center-right` | |
| `bottom-left` `bottom-center` `bottom-right` | |

```xml
<!-- Footer text anchored to bottom-left, offset 10pt from edge -->
<text anchor="bottom-left" x="10pt" y="-10pt" font-size="9pt">Footer</text>
```

## Primitives

| Element | Description |
|---------|-------------|
| [`rect`](?p=doc/canvas/rect) | Filled or stroked rectangle |
| [`circle`](?p=doc/canvas/circle) | Circle |
| [`ellipse`](?p=doc/canvas/circle) | Ellipse, with separate x and y radii |
| [`line`](?p=doc/canvas/line) | Straight line between two points |
| [`path`](?p=doc/canvas/path) | SVG path data |
| [`text`](?p=doc/canvas/text) | Absolutely positioned text |
| [`img`](?p=doc/canvas/img) | Absolutely positioned image |

Canvas elements are not data-bound: `data-*` attributes have no effect on them. For text that changes per document, use the layout, or a `region` for page furniture.

## DRAFT watermark example

```xml
<canvas>
  <layer page="each" opacity="0.12" transform="rotate(45, 306, 396)">
    <text x="100pt" y="420pt" font-size="72pt" color="#cc0000">DRAFT</text>
  </layer>
</canvas>
```
