# Text at

`text-at` is text at a fixed place on the page, in a [layer](?p=doc/layer). It is the [`text`](?p=doc/layout/text) of the layout with the same defaults and the same spans, but it does not flow or paginate: it stays at its `x` and `y`, on the pages its layer selects.

## Attributes

| Attribute     | Type      | Default     | Description |
|---------------|-----------|-------------|-------------|
| `x`           | signed pt | —           | X of the left edge of the text's box (or offset from anchor) |
| `y`           | signed pt | —           | Y of the top edge of the text's box (or offset from anchor) |
| `anchor`      | string    | —           | Reference point: when set, `x` and `y` are offsets, and the box's matching point is placed there |
| `width`       | pt        | —           | Width of the box. See [Width and lines](#width-and-lines) |
| `max-lines`   | integer   | `1`         | The most lines drawn. Above 1 it needs a `width` |
| `ellipsis`    | boolean   | `false`     | End the last line drawn in an ellipsis when the text does not fit |
| `line-height` | number or token | `1.2` (`m`) | The distance between lines, as a factor of the font size: a number above 0, or a name from the `line-height` row of `tokens` |
| `font`        | string    | the layer's `font`, else the document's, or `Helvetica` | Font name: a built-in font or one declared in `assets` |
| `font-size`   | token/pt  | the layer's, else `m` (11pt) | `xs` `s` `m` `l` `xl` `xxl` or `14pt` |
| `bold`        | boolean   | `false`     | The bold face of a built-in font |
| `color`       | color     | the layer's, else `#1a1a1a` | Text color: `#333333` or a named token. A color named `text` in `tokens` changes the default |
| `align`       | string    | `left`      | `left` `center` `right` `justify`, within `width` |
| `data-value`  | string    | —           | Dot-path: replaces the text with the bound value. See [Text from data](#text-from-data) |
| `data-if`     | string    | —           | Draw only when the value is truthy |
| `data-if-not` | string    | —           | Draw only when the value is falsy |

Either `anchor` or both `x` and `y` must be provided. To fade text, put it in a layer with `opacity`.

`max-lines`, `ellipsis` and `line-height` are the attributes of the layout's [`text`](?p=doc/layout/text#capping-a-text), with the same names and meaning. What differs is the defaults: a `text-at` is one line, and `max-lines` above 1 needs a `width` to wrap within.

## Defaults

Text has one set of defaults wherever it is. In a layer it takes, for what it sets none of itself, the `font`, `font-size` and `color` of its [layer](?p=doc/layer#text-style), and when the layer sets none either, the document's `font` or Helvetica, 11pt (the `m` text size) and the `text` color: `#1a1a1a`, unless the document defines a color named `text`.

## Width and lines

Text is one line unless told otherwise.

| `width` | `max-lines` | Result |
|---------|-------------|--------|
| —       | —           | One line at its natural width: the width its characters need in its font and size. `align` has no effect, and a long text runs on past the edge of the page |
| —       | 2 or more   | An error: there is nothing to wrap at |
| set     | — (1)       | One line. What goes past the width is cut off, or ends in an ellipsis with `ellipsis="true"` |
| set     | 2 or more   | Wraps within the width, up to that many lines. Only whole lines are drawn, and the rest of the text is dropped |

A label, a page number or a stamp needs only `x`, `y` and maybe `anchor`:

```xml
<layer page="each">
  <text-at x="48pt" y="40pt" font-size="l" bold="true">Quarterly report</text-at>
  <text-at anchor="top-right" x="-48pt" y="44pt" color="#777777">Confidential</text-at>
</layer>
```

A text that runs past the edge of the page is cut off there, but it is still in the PDF: searching or copying the text can find words nobody can see.

`max-lines` follows the line height, so a cut always falls between whole lines.

```xml
<layer>
  <text-at x="48pt" y="600pt" width="200pt" max-lines="3" ellipsis="true">
    A note that is kept to three lines, and that ends in an ellipsis when it is longer than that.
  </text-at>
</layer>
```

## Anchoring

The text's box is its natural width, or `width`, by the lines drawn × `font-size` × `line-height`. So `anchor` places the text vertically too: a text anchored at the bottom grows upwards as lines are added, up to `max-lines`.

```xml
<layer page="each">
  <text-at anchor="bottom-center" y="-18pt" width="400pt" max-lines="2" align="center"
           font-size="9pt" color="#aaaaaa">
    lpdf.io — Confidential. This note is centred at the foot of the page, and a second line grows upwards from there.
  </text-at>
</layer>
```

## Page numbers

`{page}` becomes the page number and `{pages}` the number of pages. They count within the section, so the first page of a section is page 1 of its own pages.

```xml
<layer page="each">
  <text-at anchor="bottom-right" x="-48pt" y="-24pt" font-size="9pt">Page {page} of {pages}</text-at>
</layer>
```

## Inline spans for mixed styling

`span` children work like those in flow `text`:

```xml
<layer>
  <text-at x="40pt" y="60pt">
    Invoice <span color="#1a73e8" bold="true">#1042</span>
  </text-at>
</layer>
```

## Text from data

`data-value` replaces the text with the value at the path, and a layer reads single values: an array item by its index, such as `signers[0].name`. The value is the same on every page the layer is drawn on.

Text whose length you cannot control belongs in the layout. In a layer, a text that comes from data can lose its end without a warning: past `width`, past `max-lines`, or past the edge of the page. A list from data, with one text for each item, belongs in the layout too, since `data-source` is not allowed on `text-at`.

## DRAFT watermark (rotated via layer transform)

```xml
<layer page="each" opacity="0.1" transform="rotate(45, 306, 396)">
  <text-at x="50pt" y="420pt" font-size="80pt" color="#cc0000">DRAFT</text-at>
</layer>
```
