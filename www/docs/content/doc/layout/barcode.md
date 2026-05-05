# Barcode

Renders a QR code, Code 128 barcode, or EAN-13 barcode inline in the flow layout.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** `qr`, `code128`, or `ean13` |
| `data`       | string  | —       | **Required.** Payload string to encode |
| `size`       | token/pt | —      | Uniform size (width and height) for QR codes |
| `width`      | token/pt | —      | Width constraint |
| `height`     | pt      | —       | Height constraint |
| `ec`         | string  | `M`     | QR error correction: `L` `M` `Q` `H` |
| `hrt`        | boolean | false   | Show human-readable text below Code128/EAN-13 |
| `color`      | color   | `#000000` | Barcode foreground color |
| `background` | color   | —       | Background color |
| `data-value` | string  | —       | Dot-path — replaces `data` with bound value |

## QR code

```xml
<barcode type="qr" data="https://lpdf.io" size="80pt"/>
```

## QR with high error correction

```xml
<barcode type="qr" data="https://lpdf.io/docs" size="100pt" ec="H"/>
```

## Code128 with human-readable text

```xml
<barcode type="code128" data="INV-2026-001" width="160pt" height="48pt" hrt="true"/>
```

## EAN-13

```xml
<barcode type="ean13" data="5901234123457" width="120pt" height="48pt" hrt="true"/>
```

## Dynamic barcode from data

```xml
<barcode type="qr" data="https://example.com" data-value="product.url" size="80pt"/>
```
