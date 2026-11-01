# Barcode

Renders a QR code, Code 128 barcode, or EAN-13 barcode inline in the flow layout. A barcode is never stretched: with one size set, the other follows its proportions, and with both set they are a maximum.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** `qr`, `code128`, or `ean13` |
| `data`       | string  | —       | **Required.** Payload string to encode |
| `alt`        | string  | —       | What the barcode is for, which a screen reader reads in a [PDF/UA](?p=pdfua) document in place of its data: "QR code to pay this invoice". `alt=""` marks it as decoration. A PDF/UA document needs it on each barcode outside a header or a footer. A document without `pdfua` ignores it |
| `width`      | token/pt | —      | Width. Without `height`, the height follows the barcode's proportions |
| `height`     | token/pt | —      | Height of the whole barcode, with the digits of `hrt` inside it: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). Without `width`, the width follows the barcode's proportions |
| `ec`         | string  | `M`     | QR error correction: `L` `M` `Q` `H` |
| `hrt`        | boolean | false   | Show human-readable text below Code128/EAN-13. The digits take the bottom 12pt of the `height`, and the bars the rest |
| `data-value` | string  | —       | Dot-path: the data the barcode encodes comes from the bound value |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `color`      | color   | `#000000` | Barcode foreground color |
| `background` | color   | —       | Background color |
| `paginate`   | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |

## One size or both

A QR code is square, so one size is its side. An EAN-13 has the proportions of the standard symbol, and a Code 128 is as wide as its bars, whose number depends on the data. With both `width` and `height`, they are a maximum: the barcode takes the largest size that fits in them, and its box becomes that size, which the parent's `align` places. A QR code takes the smaller of the two, so it is always square and always scans.

## QR code

```xml
<barcode type="qr" data="https://lpdf.io" width="80pt"/>
```

## QR with high error correction

```xml
<barcode type="qr" data="https://lpdf.io/docs" height="100pt" ec="H"/>
```

## Code128 with human-readable text

```xml
<barcode type="code128" data="INV-2026-001" width="160pt" height="48pt" hrt="true"/>
```

## EAN-13

```xml
<barcode type="ean13" data="5901234123457" width="120pt" height="48pt" hrt="true"/>
```

`data-value` replaces the data the barcode encodes with the value at the path, and the `data` in the XML is what is encoded when no data is passed:

```xml
<barcode type="qr" data="https://lpdf.io" data-value="invoice.url" width="80pt"/>
```
