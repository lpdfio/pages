# Barcode

Renders a barcode inline in the flow layout: a QR code, a Data Matrix or a PDF417, or a linear Code 128, Code 39, EAN-13, EAN-8, UPC-A or GS1-128. A barcode is never stretched: with one size set, the other follows its proportions, and with both set they are a maximum.

## Types

| `type`           | Barcode | Data |
|------------------|---------|------|
| `qr`             | QR code | Any text |
| `datamatrix`     | Data Matrix (ECC 200), for small items and parts | Any text |
| `pdf417`         | PDF417, for boarding passes and ID cards | Any text |
| `code128`        | Code 128 | Printable ASCII, from space to `~` |
| `code39`         | Code 39, for industrial and ID labels | The digits, the capitals `A` to `Z`, the space and `- . $ / + %` |
| `ean13`          | EAN-13, for retail | 12 digits, or 13 with the check digit |
| `ean8`           | EAN-8, for small retail items | 7 digits, or 8 with the check digit |
| `upca`           | UPC-A, for retail in North America | 11 digits, or 12 with the check digit |
| `gs1-128`        | GS1-128, for shipping and pallet labels | [GS1 fields](#gs1) |
| `gs1-datamatrix` | GS1 Data Matrix | [GS1 fields](#gs1) |

An EAN-13, EAN-8 or UPC-A without its check digit gets it added, and one with it has it checked. Data a type can't hold, such as a lowercase letter in a Code 39 or a wrong check digit, draws a gray box with a red border in place of the barcode.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** One of the [types](#types) |
| `data`       | string  | —       | **Required.** What the barcode encodes |
| `alt`        | string  | —       | What the barcode is for, which a screen reader reads in a tagged document, with [`pdfua`](?p=pdfua) or a `pdfa` of [level a](?p=pdfa#level-a), in place of its data: "QR code to pay this invoice". `alt=""` marks it as decoration. A PDF/UA document needs it on each barcode outside a header or a footer; at level a without `pdfua`, a barcode without it is decoration. A document that is not tagged ignores it |
| `width`      | token/length | —      | Width. Without `height`, the height follows the barcode's proportions |
| `height`     | token/length | —      | Height of the whole barcode, with the digits of `hrt` inside it: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). Without `width`, the width follows the barcode's proportions |
| `ec`         | string  | —       | Error correction. A `qr` takes `L` `M` `Q` `H`, and `M` without it; a `pdf417` takes a level from `0` to `8`, and without it the level its data calls for. See [Error correction](#error-correction) |
| `hrt`        | boolean | false   | Show the data under the bars of a linear barcode: `code128`, `code39`, `ean13`, `ean8`, `upca` and `gs1-128`. The text takes the bottom 12pt of the `height`, and the bars the rest |
| `rows`       | integer | —       | The rows of a `pdf417`, or of a `datamatrix` or `gs1-datamatrix`. See [Rows and columns](#rows-and-columns) |
| `columns`    | integer | —       | The columns of a `pdf417`, or of a `datamatrix` or `gs1-datamatrix`. See [Rows and columns](#rows-and-columns) |
| `check`      | boolean | false   | Add the mod 43 check character to a `code39`, as HIBC health care labels ask |
| `data-value` | string  | —       | Dot-path: the data the barcode encodes comes from the bound value |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `color`      | color   | `#000000` | Barcode foreground color |
| `background` | color   | —       | Background color |
| `paginate`   | string  | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

`ec`, `hrt`, `rows`, `columns` and `check` are each used by the types named in their row. The other types ignore them, and a `qr` ignores a number in `ec`, as a `pdf417` does a letter.

## One size or both

With both `width` and `height`, they are a maximum: the barcode takes the largest size that fits in them, and its box becomes that size, which the parent's `align` places. With one, the other follows the barcode's proportions.

- A **QR code** is square, so one size is its side. With both, it takes the smaller of the two, so it is always square and always scans.
- A **Data Matrix** with one size is the smallest square that holds its data.
- A **PDF417** with one size takes the number of columns that makes it closest to three times as wide as high.
- A **Code 128**, **Code 39** or **GS1-128** is as wide as its bars, whose number depends on the data.
- An **EAN-13**, **EAN-8** or **UPC-A** has the proportions of the standard symbol.

Without a size, a Code 128, Code 39 or GS1-128 is 1pt per module with bars 40pt high, an EAN-13 or UPC-A is the standard symbol, 0.33mm per module with bars 22.85mm high, and an EAN-8 0.33mm per module with bars 18.23mm high. A QR code, a Data Matrix and a PDF417 need a size.

## Rows and columns

A Data Matrix and a PDF417 come in many shapes. Without `rows` and `columns`, a barcode with both sizes takes the shape that comes out largest in them, so a wide box gets a wide code.

- A **PDF417** has 1 to 30 `columns` of codewords and 3 to 90 `rows`.
- A **Data Matrix** has one of the standard's sizes, in modules: the squares from 10×10 to 144×144, and the rectangles 8×18, 8×32, 12×26, 12×36, 16×36 and 16×48.

`rows` and `columns` together fix the shape; one of them alone narrows the shapes the barcode chooses from. Data that needs more gets more: a PDF417 more rows, and more columns once it has 90 rows, and a Data Matrix the next size up. A number a type doesn't have, such as 2 rows of a PDF417 or 11 rows of a Data Matrix, is an error.

```xml
<barcode type="pdf417" data="Boarding pass LPDF 2026, seat 12A" columns="4" width="200pt"/>
```

## Error correction

Error correction is how much of a barcode can be damaged and still scan. A QR code takes `L`, `M`, `Q` or `H`, from about 7% to 30% of the code. A PDF417 takes a level from `0` to `8`, each adding twice the codewords of the one before, and without `ec` the level the standard recommends for the length of its data. A Data Matrix's error correction is fixed by its size.

```xml
<barcode type="pdf417" data="Boarding pass LPDF 2026, seat 12A" width="240pt" ec="5"/>
```

## GS1

A `gs1-128` or `gs1-datamatrix` carries GS1 fields, written as they are printed: each field's application identifier (AI) in parentheses, then its value.

```xml
<barcode type="gs1-128" data="(01)09501101530003(17)261231(10)AB12" height="60pt" hrt="true"/>
```

Scanners read the data as GS1 fields, from the FNC1 that starts the barcode. Between fields, the barcode marks where a field of varying length ends, as GS1 asks; the parentheses mark the fields and aren't encoded. The data is checked: an AI of 2 to 4 digits before each value, GS1's characters only, the length of each field whose AI has a fixed one, such as 14 digits for `(01)`, and the check digit of a GTIN `(01)` `(02)`, an SSCC `(00)` and a GLN `(410)` to `(417)`. A GS1-128 holds 48 characters of fields at most. `hrt` shows the fields with their parentheses.

## QR code

```xml
<barcode type="qr" data="https://lpdf.io" width="80pt"/>
```

## QR with high error correction

```xml
<barcode type="qr" data="https://lpdf.io/docs" height="100pt" ec="H"/>
```

## Data Matrix

```xml
<barcode type="datamatrix" data="LP-2026-0042" width="60pt"/>
```

## GS1 Data Matrix

```xml
<barcode type="gs1-datamatrix" data="(01)09501101530003(17)261231(10)AB12" width="60pt"/>
```

## Code128 with human-readable text

```xml
<barcode type="code128" data="INV-2026-001" width="160pt" height="48pt" hrt="true"/>
```

## Code 39 with its check character

```xml
<barcode type="code39" data="LPDF-2026" height="48pt" hrt="true" check="true"/>
```

## EAN-13

```xml
<barcode type="ean13" data="5901234123457" width="120pt" height="48pt" hrt="true"/>
```

## EAN-8 and UPC-A

```xml
<row gap="24pt">
  <barcode type="ean8" data="9638507" height="48pt" hrt="true"/>
  <barcode type="upca" data="03600029145" height="48pt" hrt="true"/>
</row>
```

## Data from the document's data

`data-value` replaces the data the barcode encodes with the value at the path, and the `data` in the XML is what is encoded when no data is passed:

```xml
<barcode type="qr" data="https://lpdf.io" data-value="invoice.url" width="80pt"/>
```
