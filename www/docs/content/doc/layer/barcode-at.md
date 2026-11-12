# Barcode at

A barcode at a fixed place on the page, in a [layer](?p=doc/layer). It is the [`barcode`](?p=doc/layout/barcode) of the layout, placed by `x` and `y`.

## Attributes

| Attribute     | Type      | Default   | Description |
|---------------|-----------|-----------|-------------|
| `type`        | string    | —         | **Required.** One of the [barcode types](?p=doc/layout/barcode#types): `qr`, `datamatrix`, `pdf417`, `code128`, `code39`, `ean13`, `ean8`, `upca`, `gs1-128` or `gs1-datamatrix` |
| `data`        | string    | —         | **Required.** Payload string to encode |
| `x`           | signed length | —         | X of the left edge of the barcode's box (or offset from anchor) |
| `y`           | signed length | —         | Y of the top edge of the barcode's box (or offset from anchor) |
| `anchor`      | string    | —         | Reference point: when set, `x` and `y` are offsets, and the box's matching point is placed there |
| `width`       | length        | —         | Width. At least one of `width` and `height` is required |
| `height`      | length        | —         | Height of the whole barcode, with the digits of `hrt` inside it |
| `ec`          | string    | —         | Error correction: `L` `M` `Q` `H` for a `qr` (`M` without it), `0` to `8` for a `pdf417`. See [Error correction](?p=doc/layout/barcode#error-correction) |
| `hrt`         | boolean   | `false`   | Show the data under the bars of a linear barcode: `code128`, `code39`, `ean13`, `ean8`, `upca` and `gs1-128` |
| `rows`        | integer   | —         | The rows of a `pdf417`, `datamatrix` or `gs1-datamatrix`. See [Rows and columns](?p=doc/layout/barcode#rows-and-columns) |
| `columns`     | integer   | —         | The columns of a `pdf417`, `datamatrix` or `gs1-datamatrix`. See [Rows and columns](?p=doc/layout/barcode#rows-and-columns) |
| `check`       | boolean   | `false`   | Add the mod 43 check character to a `code39` |
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
- A **Data Matrix** with one size is the smallest square that holds its data, and a **PDF417** takes the columns that make it closest to three times as wide as high.
- An **EAN-13**, **EAN-8** or **UPC-A** has the proportions of the standard symbol.
- A **Code 128**, **Code 39** or **GS1-128** is as wide as its bars, whose number depends on the data.
- With **both** sizes, they are a maximum: the barcode takes the largest size that fits in them, and its box becomes that size, so `anchor` places the barcode itself. A QR code takes the smaller of the two.

With `hrt`, `height` is the whole barcode: the digits take the bottom 12pt of it, and the bars the rest. `ec`, `hrt`, `rows`, `columns` and `check` work as on [`barcode`](?p=doc/layout/barcode), and the types that don't use one ignore it.

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

## PDF417 on a ticket

```xml
<layer page="first">
  <barcode-at type="pdf417" data="Ticket LPDF-2026-0042, row 12, seat 7" x="48pt" y="48pt" width="220pt"/>
</layer>
```

## Data from the document's data

```xml
<layer>
  <barcode-at type="qr" data="https://lpdf.io/pending" data-value="invoice.url" x="48pt" y="48pt" width="80pt"/>
</layer>
```
