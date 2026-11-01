# Layer

A `layer` is fixed content on the page: shapes, text, images and barcodes, each at the position and size it is given. Use it for watermarks, stamps, page numbers, running heads, page borders, letterhead and backgrounds that reach the edge of the page. A layer is a child of the [`section`](?p=doc/section), next to its [`layout`](?p=doc/layout).

## In the section

A section holds any number of layers and at most one layout, painted in the order they are written: each one is drawn over the ones before it.

- A layer before the layout is painted under it, and a layer after the layout is painted over it.
- Among layers, the one written later is painted on top.
- A section with no layout is one page. A second `layout` is an error.
- A layer cannot hold another layer, and it holds no flow elements: text in a layer is a `text-at`, not a `text`.

```xml
<section>
  <layer>
    <!-- under the layout: a band across the top of every page -->
    <rect x="0pt" y="0pt" width="612pt" height="28pt" fill="#1763cf"/>
  </layer>
  <layout margin="48pt">
    <text>The flowing text, painted over the band.</text>
  </layout>
  <layer page="each">
    <!-- over the layout: a page number at the foot of every page -->
    <text-at anchor="bottom-center" y="-24pt" font-size="9pt" color="#777777">Page {page} of {pages}</text-at>
  </layer>
</section>
```

A [`bookmark`](?p=doc/layout/bookmark) as the section's first child comes before every layer. Layers hold no bookmarks.

## Attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `page`        | string  | `each`  | Which pages the layer is drawn on: `each` `first` `last` `odd` `even`, or numbers and ranges such as `1`, `2-last` or `1,3-5` |
| `opacity`     | 0–1     | 1       | How opaque everything in the layer is. See [Opacity](#opacity) |
| `transform`   | string  | —       | Transform applied to everything in the layer. See [Transforms](#transforms) |
| `clip`        | string  | —       | A rectangle, `x y w h`, in points from the top left corner of the page. What the layer draws outside it is cut off |
| `font`        | string  | document's font, or `Helvetica` | The font of the `text-at` in the layer that sets none of its own. See [Text style](#text-style) |
| `font-size`   | token/pt | `m` (11pt) | The size of the `text-at` in the layer that sets none of its own |
| `color`       | color   | `#1a1a1a` | The color of the `text-at` in the layer that sets none of its own. Defaults to the `text` color |
| `alt`         | string  | —       | In a [PDF/UA](?p=pdfua) document, what the layer shows: a screen reader reads it as one figure at the layer's place. Without it a layer is decoration, skipped with its text. A document without `pdfua` ignores it |
| `data-if`     | string  | —       | Draw the layer only when the value at the path is truthy. See [Data in a layer](#data-in-a-layer) |
| `data-if-not` | string  | —       | Draw the layer only when the value at the path is falsy |

## Coordinate system

- The origin is the **top left corner of the page**, and y grows downward.
- Units are `pt`, `mm` and `in`. A negative `x` or `y` is allowed: it is an offset from an anchor.
- A layer ignores the layout's margin. A margin tells the flow not to come closer to the edge than this, and a layer places each element where it is told, so its coordinates and anchors measure from the page edge. This is what lets a page number sit in the margin and a background run to the edge.

To put a header or a footer inside the margins, taking up space, use a [`region`](?p=doc/layout#pinned-regions) in the layout. To put it on the page, taking up none, use a layer.

## Positioning with `anchor`

`x` and `y` place the element's box. Without `anchor`, they are its top-left corner.

With `anchor`, the element is placed against one of nine points of the page, and `x` and `y` become signed offsets from that point. The box's matching point lands there: `anchor="bottom-right"` puts the element's bottom-right corner on the page's bottom-right corner, before the offset.

| Anchor values | |
|---|---|
| `top-left` `top-center` `top-right` | |
| `center-left` `center` `center-right` | |
| `bottom-left` `bottom-center` `bottom-right` | |

```xml
<layer page="each">
  <!-- the box's bottom-right corner 36pt in from the page's, on any page size -->
  <text-at anchor="bottom-right" x="-36pt" y="-36pt" font-size="9pt">Footer</text-at>
</layer>
```

A `line` and a `path` have no box, and no anchor.

## Elements

| Element | Description |
|---------|-------------|
| [`rect`](?p=doc/layer/rect) | Filled or stroked rectangle |
| [`circle`](?p=doc/layer/circle) | Circle |
| [`ellipse`](?p=doc/layer/circle) | Ellipse, with separate x and y radii |
| [`line`](?p=doc/layer/line) | Straight line between two points |
| [`path`](?p=doc/layer/path) | SVG path data |
| [`text-at`](?p=doc/layer/text-at) | Text at a position |
| [`img-at`](?p=doc/layer/img-at) | Image at a position |
| [`barcode-at`](?p=doc/layer/barcode-at) | QR code, Code 128 or EAN-13 at a position |

A stroke is centred on the outline of its shape, so half of `stroke-width` falls outside the box. A circle at `x="0pt"` with a 2pt stroke loses 1pt of it off the page.

## Opacity

`opacity` fades everything in the layer as one: where its shapes overlap, they do not show through each other. A layer at `0` draws nothing.

To fade one element, put it in a layer of its own. The shapes and the `-at` elements have no `opacity` of their own, and the engine stops with an error that says so. A box of the layout has one: see [Opacity](?p=doc/layout#opacity).

```xml
<section>
  <layer opacity="0.15">
    <circle x="360pt" y="40pt" r="120pt" fill="#1763cf"/>
    <circle x="440pt" y="120pt" r="80pt" fill="#cc0000"/>
  </layer>
  <layer>
    <rect x="48pt" y="48pt" width="120pt" height="60pt" fill="#1763cf"/>
  </layer>
</section>
```

Colors have no alpha channel. Text that is only paler can use a lighter color, but text that must show through something needs a layer, or a [box](?p=doc/layout#opacity) with `opacity`.

## Text style

`font`, `font-size` and `color` on a layer are the defaults of its `text-at`, so a layer of labels is styled once. A `text-at` that sets its own takes its own.

```xml
<layer page="each" font-size="9pt" color="#777777">
  <text-at x="48pt" y="40pt">Quarterly report</text-at>
  <text-at anchor="top-right" x="-48pt" y="40pt">Confidential</text-at>
  <text-at anchor="bottom-center" y="-24pt" color="#cc0000">Draft: both labels above take the layer's color; this one its own</text-at>
</layer>
```

## Transforms

| Form | Effect |
|------|--------|
| `translate(x, y)` | Move by `x` and `y` |
| `scale(s)` or `scale(sx, sy)` | Scale by `s`, or by `sx` across and `sy` down |
| `rotate(deg, cx, cy)` | Rotate by `deg` degrees around the point `cx`, `cy` |
| `matrix(a, b, c, d, e, f)` | A full transform matrix |

The numbers are plain numbers in points, separated by commas or spaces. A number with a unit, such as `translate(10pt 20pt)`, is not read, and the transform does nothing.

To combine opacity and a transform, put both on one layer.

## Data in a layer

Data binding reaches layers, with two limits.

- **`data-value`** sets the text of a `text-at` and the data a `barcode-at` encodes, as it does in the layout. **`data-if` and `data-if-not`** work on `text-at`, `img-at` and `barcode-at`. The shapes take none of them: to switch a shape on or off, put it in a layer with `data-if`.
- **`data-if` and `data-if-not` on the `layer`** switch the whole layer on or off, such as a DRAFT watermark while a status is `draft`. The check happens once, so the layer is on every page its `page` selects, or on none.
- **`data-source`** is not allowed on a layer's elements: every copy would sit in the same place. A list from data belongs in the layout.
- A layer reads single values. An array item can be read by its index, `signers[0].name`, which suits a number of items fixed by the design, such as two signature lines.
- A layer drawn on several pages shows the same values on each. Only `{page}` and `{pages}` change, and they count within the section.

Text that comes from data, and so can be any length, belongs in the layout. In a layer, a longer text loses its end without a warning. See [`text-at`](?p=doc/layer/text-at#text-from-data).

## DRAFT watermark

```xml
<section>
  <layer page="each" opacity="0.12" transform="rotate(45, 306, 396)" data-if="draft">
    <text-at x="100pt" y="420pt" font-size="72pt" color="#cc0000">DRAFT</text-at>
  </layer>
  <layout margin="48pt">
    <text>A document with a status.</text>
  </layout>
</section>
```

`data-if="draft"` draws the watermark only when the data passed to `render` has a truthy `draft`. A document rendered with no data at all is drawn as written, watermark included.
