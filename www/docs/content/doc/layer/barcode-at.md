# Barcode at

A QR code, a Code 128 or an EAN-13 at a fixed place on the page, in a [layer](?p=doc/layer). It is the [`barcode`](?p=doc/layout/barcode) of the layout, placed by `x` and `y`.

## Attributes

| Attribute     | Type      | Default   | Description |
|---------------|-----------|-----------|-------------|
| `type`        | string    | —         | **Required.** `qr`, `code128` or `ean13` |
| `data`        | string    | —         | **Required.** Payload string to encode |
| `x`           | signed pt | —         | X of the left edge of the barcode's box (or offset from anchor) |
| `y`           | signed pt | —         | Y of the top edge of the barcode's box (or offset from anchor) |
| `anchor`      | string    | —         | Reference point: when set, `x` and `y` are offsets, and the box's matching point is placed there |
| `width`       | pt        | —         | Width. At least one of `width` and `height` is required |
| `height`      | pt        | —         | Height of the whole barcode, with the digits of `hrt` inside it |
| `ec`          | string    | `M`       | QR error correction: `L` `M` `Q` `H` |
| `hrt`         | boolean   | `false`   | Show human-readable text below Code 128 and EAN-13 |
| `color`       | color     | `#000000` | Barcode foreground color |
| `background`  | color     | —         | Background color |
| `data-value`  | string    | —         | Dot-path: the data the barcode encodes comes from the bound value |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-if`     | string    | —         | Draw only when the value at the path is truthy |
| `data-if-not` | string    | —         | Draw only when the value at the path is falsy |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

Either `anchor` or both `x` and `y` must be provided.

## One size or both

A barcode needs `width` or `height`, and the other follows the barcode's proportions. It is never stretched.

- A **QR code** is square, so one size is the side.
- An **EAN-13** has the proportions of the standard symbol.
- A **Code 128** is as wide as its bars, whose number depends on the data.
- With **both** sizes, they are a maximum: the barcode takes the largest size that fits in them, and its box becomes that size, so `anchor` places the barcode itself. A QR code takes the smaller of the two.

With `hrt`, `height` is the whole barcode: the digits take the bottom 12pt of it, and the bars the rest.

## QR code in the corner

```xml
<layer page="first">
  <barcode-at type="qr" data="https://lpdf.io" anchor="bottom-right" x="-36pt" y="-36pt" width="72pt"/>
</layer>
```

## Code 128 with human-readable text

```xml
<layer page="each">
  <barcode-at type="code128" data="INV-2026-001" x="48pt" y="48pt" width="160pt" height="48pt" hrt="true"/>
</layer>
```

## Data from the document's data

```xml
<layer>
  <barcode-at type="qr" data="https://lpdf.io/pending" data-value="invoice.url" x="48pt" y="48pt" width="80pt"/>
</layer>
```
