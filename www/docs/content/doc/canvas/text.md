# Text (canvas)

Absolutely positioned text. Unlike flow `text`, canvas text does not participate in layout and will not paginate — it is rendered at the exact coordinates you specify.

## Attributes

| Attribute     | Type      | Default | Description |
|---------------|-----------|---------|-------------|
| `x`           | signed pt | —       | X position (or offset from anchor) |
| `y`           | signed pt | —       | Y position (or offset from anchor) |
| `anchor`      | string    | —       | Reference point |
| `font`        | string    | inherit | Font name declared in `assets` |
| `font-size`   | token/pt  | inherit | Font size |
| `color`       | color     | —       | Text color |
| `align`       | string    | `left`  | `left` `center` `right` `justify` |
| `w`           | pt        | —       | Text wrap width |
| `line-height` | number    | —       | Line height multiplier |
| `opacity`     | 0–1       | 1       | Opacity |
| `data-value`  | string    | —       | Dot-path — replaces text content |

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

## DRAFT watermark (rotated via layer transform)

```xml
<canvas>
  <layer page="each" opacity="0.1">
    <layer transform="rotate(45, 306, 396)">
      <text x="50pt" y="420pt" font-size="80pt" color="#cc0000">DRAFT</text>
    </layer>
  </layer>
</canvas>
```

## Inline spans for mixed styling

`span` children work the same as in flow `text`:

```xml
<text x="40pt" y="60pt" font-size="m">
  Invoice <span color="#1a73e8">#1042</span>
</text>
```

## Data-bound footer

```xml
<canvas>
  <layer page="each">
    <text anchor="bottom-right" x="-18pt" y="-18pt"
          font-size="9pt" color="#aaaaaa" data-value="meta.page">1</text>
  </layer>
</canvas>
```
