# Text (canvas)

Absolutely positioned text. Unlike flow `text`, canvas text does not participate in layout and will not paginate — it is rendered at the exact coordinates you specify. It does not inherit the document's font or size.

## Attributes

| Attribute     | Type      | Default     | Description |
|---------------|-----------|-------------|-------------|
| `x`           | signed pt | —           | X position (or offset from anchor) |
| `y`           | signed pt | —           | Y position (or offset from anchor) |
| `anchor`      | string    | —           | Reference point |
| `font`        | string    | `Helvetica` | Font name: a built-in font or one declared in `assets` |
| `font-size`   | pt        | `12pt`      | Font size. A token such as `m` is not accepted here; `mm` and `in` are |
| `color`       | color     | `#000000`   | Text color |
| `align`       | string    | `left`      | `left` `center` `right` `justify` |
| `w`           | pt        | —           | Text wrap width. Without it, text wraps at the right edge of the page |
| `line-height` | number    | `1.2`       | Line height multiplier |
| `opacity`     | 0–1       | 1           | Opacity |

Either `anchor` or both `x` and `y` must be provided.

## Page footer on every page

```xml
<canvas>
  <layer page="each">
    <text anchor="bottom-center" y="-18pt"
          font-size="9pt" color="#aaaaaa" align="center">
      lpdf.io — Confidential
    </text>
  </layer>
</canvas>
```

Canvas text is not data-bound, and the page number placeholders work only in the text of a layout [`region`](?p=doc/layout#pinned-regions). For a footer with the page number, use a region.

## DRAFT watermark (rotated via layer transform)

```xml
<canvas>
  <layer page="each" opacity="0.1" transform="rotate(45, 306, 396)">
    <text x="50pt" y="420pt" font-size="80pt" color="#cc0000">DRAFT</text>
  </layer>
</canvas>
```

## Inline spans for mixed styling

`span` children work like those in flow `text`, but only `font` and `color` are read:

```xml
<canvas>
  <layer>
    <text x="40pt" y="60pt" font-size="11pt">
      Invoice <span color="#1a73e8">#1042</span>
    </text>
  </layer>
</canvas>
```
