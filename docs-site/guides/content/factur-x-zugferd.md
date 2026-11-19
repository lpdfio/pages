---
title: "Create a Factur-X / ZUGFeRD invoice PDF from its XML in {{language}}"
description: "Turn the XML your accounting software writes into a Factur-X / ZUGFeRD PDF/A-3 invoice in {{language}} with Lpdf: one template, one call, then a check."
---

A Factur-X invoice, called ZUGFeRD in Germany, is one PDF that holds an invoice twice: as pages people read, and as XML that accounting software reads. France and Germany accept it as an electronic invoice. Your accounting software, or an e-invoice library, already writes the XML. This guide turns that XML into the Factur-X PDF with [Lpdf](https://lpdf.io/): a template for the look, and one call.

## What you get

[invoice-2026-0412.pdf](../files/invoice-2026-0412.pdf), made by the code on this page:

- one A4 page, filled from the XML
- the XML inside the PDF as `factur-x.xml`, byte for byte as it came
- a PDF/A-3b file, the archive form of PDF that may carry other files, which Factur-X asks for

## What you need

::: sdk js
- Node.js 20 or later
- Lpdf 0.36 or later:

  ```sh
  npm install @lpdfio/lpdf
  ```
:::

::: sdk python
- Python 3.11 or later
- Lpdf 0.36 or later, in a virtual environment:

  ```sh
  python3 -m venv .venv
  source .venv/bin/activate    # on Windows: .venv\Scripts\activate
  pip install lpdfio-lpdf
  ```

  Or `pip install -r requirements.txt`, with [requirements.txt](../files/python/requirements.txt), which pins 0.36.0.
:::

::: sdk java
- Java 17 or later, and [Maven](https://maven.apache.org/)
- Lpdf 0.36 or later, which Maven fetches from Maven Central on the first run. Save [pom.xml](../files/java/pom.xml) in your folder: it sets up both scripts, and holds this dependency:

  ```xml
  <dependency>
      <groupId>io.lpdf</groupId>
      <artifactId>lpdf</artifactId>
      <version>0.36.0</version>
  </dependency>
  ```
:::

::: sdk dotnet
- The .NET 10 SDK or later, which runs a single `.cs` file with `dotnet run`. The Lpdf package itself needs .NET 8 or later.
- Lpdf 0.36 or later. Each script names it on its first line, `#:package Lpdfio.Lpdf@0.36.0`, and `dotnet run` fetches it from NuGet: there is nothing to install.
:::

::: sdk php
- PHP 8.2 or later, with the DOM extension (`ext-dom`; on Debian and Ubuntu it is the `php-xml` package), and [Composer](https://getcomposer.org/)
- A way for Lpdf to run its engine, which the package picks itself: PHP's FFI extension (`ext-ffi`), on Linux with glibc 2.17 or newer, or the [`wasmtime`](https://wasmtime.dev) program on your `PATH`, everywhere else, such as macOS and Windows
- Lpdf 0.36 or later:

  ```sh
  composer require lpdfio/lpdf
  ```
:::

- The invoice's XML: an EN 16931 invoice in the Cross Industry Invoice format, the XML every Factur-X and ZUGFeRD invoice carries, of the profile BASIC, EN 16931, EXTENDED or XRECHNUNG. This guide uses a sample, [in/invoice-2026-0412.xml](../files/in/invoice-2026-0412.xml). No XML yet? A library writes it, such as Mustang for Java, horstoeko/zugferd for PHP or ZUGFeRD-csharp for .NET.
- A font file to embed, since a PDF/A file embeds every font it uses. This guide uses [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), free under the SIL Open Font License. It is in the downloads: save [SourceSans3-Regular.otf](../files/fonts/SourceSans3-Regular.otf) as `fonts/SourceSans3-Regular.otf`, and keep its license, [OFL-SourceSans3.txt](../files/fonts/OFL-SourceSans3.txt), beside it
- A logo for the header: PNG, JPEG, SVG and other image files work. This guide uses [logo.png](../files/logo.png), made up for the sample seller, saved as `logo.png`

## 1. Write the template

The template, [invoice-template.xml](../files/invoice-template.xml), says how the invoice looks. This is the page it makes from the sample invoice:

![The invoice page the template makes from the sample XML: the logo, the seller and the buyer, two lines, the VAT and the total, and a note.](/guides/factur-x-zugferd/files/invoice-2026-0412.png)

Each `data-value="invoice:…"` takes a value from the invoice's XML, by the names of Lpdf's default map: `invoice:seller.name`, `invoice:totals.gross`. The `tr` with `data-source="invoice:lines"` repeats for each line, and inside it a name without the prefix is the line's own, `name` or `net`. The row with `data-if="invoice:totals.vatInTaxCurrency"` shows only on an invoice that has a tax currency. `note` has no prefix: it comes from your own data, since the XML has no such line.

The logo is declared in `assets`, as the font is, and the `img` at the top of the header places it: 130pt wide, and as high as its proportions make it.

```xml title="invoice-template.xml"
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/SourceSans3-Regular.otf"/>
    <image name="logo" src="logo.png"/>
  </assets>
  <document size="a4" font="body">
    <meta title="Invoice" author="Northwind Paper SAS" lang="en"/>
    <section>
      <layout margin="48pt">
        <column gap="l">
          <row align="end">
            <column width="fill" gap="xs">
              <img name="logo" width="130pt"/>
              <text font-size="20pt" data-value="invoice:seller.name">Seller</text>
              <text font-size="9pt" color="#5b6475" data-value="invoice:seller.street">Street</text>
              <row gap="xs">
                <text font-size="9pt" color="#5b6475" data-value="invoice:seller.postcode">00000</text>
                <text font-size="9pt" color="#5b6475" data-value="invoice:seller.city">City</text>
              </row>
              <row gap="xs">
                <text font-size="9pt" color="#5b6475">VAT</text>
                <text font-size="9pt" color="#5b6475" data-value="invoice:seller.vatId">Number</text>
              </row>
            </column>
            <row gap="xs">
              <text font-size="16pt" color="#1763cf" data-value="invoice:typeCode">Invoice</text>
              <text font-size="16pt" color="#1763cf" data-value="invoice:number">0000</text>
            </row>
          </row>
          <divider color="#dde3ed" thickness="0.5pt"/>
          <row gap="l">
            <column width="fill" gap="xs">
              <text font-size="9pt" color="#5b6475">Billed to</text>
              <text data-value="invoice:buyer.name">Buyer</text>
              <text data-value="invoice:buyer.street">Street</text>
              <row gap="xs">
                <text data-value="invoice:buyer.postcode">00000</text>
                <text data-value="invoice:buyer.city">City</text>
              </row>
            </column>
            <column width="fill" gap="xs">
              <text font-size="9pt" color="#5b6475">Issued · Due</text>
              <text data-value="invoice:issued">1 January 2026</text>
              <row data-source="invoice:paymentTerms">
                <text data-value="due">31 January 2026</text>
              </row>
            </column>
          </row>
          <table cols="4fr 1fr 1fr 1fr 1fr 1fr">
            <thead>
              <td><text font-size="9pt" color="#5b6475">Item</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">Qty</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">Unit</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">Price</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">VAT %</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">Amount</text></td>
            </thead>
            <tr data-source="invoice:lines">
              <td><text data-value="name">Item</text></td>
              <td><text align="right" data-value="quantity">1</text></td>
              <td><text align="right" data-value="unit">pcs</text></td>
              <td><text align="right" data-value="unitPrice">0.00</text></td>
              <td><text align="right" data-value="vatRate">0</text></td>
              <td><text align="right" data-value="net">0.00</text></td>
            </tr>
          </table>
          <divider color="#dde3ed" thickness="0.5pt"/>
          <table cols="1fr 1fr 1fr">
            <thead>
              <td><text font-size="9pt" color="#5b6475">VAT rate (%)</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">Basis</text></td>
              <td><text font-size="9pt" color="#5b6475" align="right">VAT</text></td>
            </thead>
            <tr data-source="invoice:taxes">
              <td><text data-value="rate">0</text></td>
              <td><text align="right" data-value="basis">0.00</text></td>
              <td><text align="right" data-value="amount">0.00</text></td>
            </tr>
          </table>
          <column gap="xs" align="end">
            <row gap="xs">
              <text>VAT</text>
              <text data-value="invoice:totals.vat">0.00</text>
              <text data-value="invoice:totals.currency">EUR</text>
            </row>
            <row gap="xs" data-if="invoice:totals.vatInTaxCurrency">
              <text font-size="9pt" color="#5b6475">VAT in</text>
              <text font-size="9pt" color="#5b6475" data-value="invoice:totals.taxCurrency">EUR</text>
              <text font-size="9pt" color="#5b6475" data-value="invoice:totals.vatInTaxCurrency">0.00</text>
            </row>
            <row gap="xs">
              <text font-size="14pt">Total</text>
              <text font-size="14pt" data-value="invoice:totals.gross">0.00</text>
              <text font-size="14pt" data-value="invoice:totals.currency">EUR</text>
            </row>
          </column>
          <text data-if="note" data-value="note" font-size="9pt" color="#5b6475">A note</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
```

The template has nothing of Factur-X in it: no PDF/A level and no attachment. The call adds both. Opened in the Lpdf extension for VS Code, it shows its own text, `Seller` and `0.00`, in place of the invoice's values, so you can work on the look before you have an invoice to fill it with.

## 2. Make the PDF

The script reads the XML and makes the PDF in one call. `format` writes the values for the page: the invoice has dates as `2026-10-31`, amounts as `69.60` and codes such as `H87` for pieces, and the functions turn them into the words your customers read. `data` carries what the XML lacks, here the note. A PDF/A file carries the date it was made, so the call gets it as `{{createdOn}}`.

::: sdk js
The script, [make-invoice.mjs](../files/node/make-invoice.mjs):

```javascript title="make-invoice.mjs"
import { L, LCrossIndustryInvoice } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

// The invoice's XML, as your accounting software wrote it. Any file name works.
const invoiceXml = readFileSync('in/invoice-2026-0412.xml')

// How values are written on the page: the language's own formatters, and the words for the codes.
const codeNames = {
    'typeCode':   { 380: 'Invoice', 381: 'Credit note' },
    'lines.unit': { H87: 'pcs', KGM: 'kg' },
}
const format = {
    date:   (value) => new Date(value).toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' }),
    amount: (value) => Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2 }),
    code:   (value, entryName) => codeNames[entryName]?.[value] ?? value,
}

const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), readFileSync('invoice-template.xml', 'utf8'), {
    invoiceXml,
    format,
    data: { note: 'Payable within 30 days, by bank transfer.' },
    createdOn: new Date().toISOString(),
})

writeFileSync('invoice-2026-0412.pdf', pdf)
```

Run it:

```sh
node make-invoice.mjs
```
:::

::: sdk python
The script, [make_invoice.py](../files/python/make_invoice.py):

```python title="make_invoice.py"
from datetime import UTC, date, datetime
from decimal import Decimal
from pathlib import Path

from lpdf import InvoiceFormat, L, LCrossIndustryInvoice

# The invoice's XML, as your accounting software wrote it. Any file name works.
invoice_xml = Path("in/invoice-2026-0412.xml").read_bytes()

# How values are written on the page: the language's own formatters, and the words for the codes.
code_names = {
    "typeCode": {"380": "Invoice", "381": "Credit note"},
    "lines.unit": {"H87": "pcs", "KGM": "kg"},
}

invoice_format = InvoiceFormat(
    # The day has no leading zero. The month is in English, unless the program sets a locale.
    date=lambda value, _: "{0.day} {0:%B %Y}".format(date.fromisoformat(value)),
    amount=lambda value, _: f"{Decimal(value):,.2f}",
    code=lambda value, entry_name: code_names.get(entry_name, {}).get(value, value),
)

pdf = LCrossIndustryInvoice.generate_pdf(
    L.engine(),
    Path("invoice-template.xml").read_text(encoding="utf-8"),
    invoice_xml=invoice_xml,
    format=invoice_format,
    data={"note": "Payable within 30 days, by bank transfer."},
    created_on=datetime.now(UTC).isoformat(),
)

Path("invoice-2026-0412.pdf").write_bytes(pdf)
```

The SDK's names are in snake case in Python: `generate_pdf`, `invoice_xml`, `created_on`.

Run it:

```sh
python make_invoice.py
```
:::

::: sdk java
The script, [MakeInvoice.java](../files/java/MakeInvoice.java):

```java title="MakeInvoice.java"
import io.lpdf.EngineOptions;
import io.lpdf.GeneratePdfOptions;
import io.lpdf.InvoiceFormat;
import io.lpdf.L;
import io.lpdf.LCrossIndustryInvoice;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;
import java.util.Map;

public class MakeInvoice {
    public static void main(String[] args) throws IOException {
        // The invoice's XML, as your accounting software wrote it. Any file name works.
        byte[] invoiceXml = Files.readAllBytes(Path.of("in/invoice-2026-0412.xml"));

        // How values are written on the page: the language's own formatters, and the words for the codes.
        var dateFormat = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.UK);
        var amountFormat = NumberFormat.getNumberInstance(Locale.UK);
        amountFormat.setMinimumFractionDigits(2);
        Map<String, Map<String, String>> codeNames = Map.of(
            "typeCode", Map.of("380", "Invoice", "381", "Credit note"),
            "lines.unit", Map.of("H87", "pcs", "KGM", "kg"));
        var format = new InvoiceFormat()
            .date((value, entryName) -> LocalDate.parse(value).format(dateFormat))
            .amount((value, entryName) -> amountFormat.format(new BigDecimal(value)))
            .code((value, entryName) -> codeNames.getOrDefault(entryName, Map.of()).getOrDefault(value, value));

        // Java reads the template's font and image files, each a `src`, only through the engine.
        var engine = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))));

        byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, Files.readString(Path.of("invoice-template.xml")),
            new GeneratePdfOptions()
                .invoiceXml(invoiceXml)
                .format(format)
                .data(Map.of("note", "Payable within 30 days, by bank transfer."))
                .createdOn(Instant.now().toString()));

        Files.write(Path.of("invoice-2026-0412.pdf"), pdf);
    }
}
```

Run it:

```sh
mvn -q compile exec:java -Dexec.mainClass=MakeInvoice
```

`-q` keeps Maven's own messages out, so a run that works prints nothing. When Lpdf stops with an error, Maven shows its message at the end of the `[ERROR] Failed to execute goal …` line.
:::

::: sdk dotnet
The script, [MakeInvoice.cs](../files/dotnet/MakeInvoice.cs):

```csharp title="MakeInvoice.cs"
#:package Lpdfio.Lpdf@0.36.0
#:property PublishAot=false

using System.Globalization;
using Lpdf;
using Lpdf.Engine;

// The invoice's XML, as your accounting software wrote it. Any file name works.
var invoiceXml = File.ReadAllBytes("in/invoice-2026-0412.xml");

// How values are written on the page: the language's own formatters, and the words for the codes.
var british = CultureInfo.GetCultureInfo("en-GB");
var codeNames = new Dictionary<string, Dictionary<string, string>>
{
    ["typeCode"] = new() { ["380"] = "Invoice", ["381"] = "Credit note" },
    ["lines.unit"] = new() { ["H87"] = "pcs", ["KGM"] = "kg" },
};
var format = new InvoiceFormat
{
    Date = (value, _) => DateOnly.Parse(value, CultureInfo.InvariantCulture).ToString("d MMMM yyyy", british),
    Amount = (value, _) => decimal.Parse(value, CultureInfo.InvariantCulture).ToString("N2", british),
    Code = (value, entryName) => codeNames.GetValueOrDefault(entryName)?.GetValueOrDefault(value) ?? value,
};

// The engine reads the font's and the image's src through SrcFallback, which here reads the file from disk.
using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });
var pdf = LCrossIndustryInvoice.GeneratePdf(engine, File.ReadAllText("invoice-template.xml"), new()
{
    InvoiceXml = invoiceXml,
    Format = format,
    Data = new { note = "Payable within 30 days, by bank transfer." },
    CreatedOn = DateTimeOffset.Now.ToString("o"),
});

File.WriteAllBytes("invoice-2026-0412.pdf", pdf);
```

The first two lines are for `dotnet run`. `#:package` fetches Lpdf. `#:property PublishAot=false` switches off the native AOT (ahead-of-time compilation) setup that .NET 10 gives a single file: Lpdf turns your document and data into JSON through reflection, which native AOT does not allow. C# reads the font's `src` only through the engine's `SrcFallback`: without it the font isn't embedded, which PDF/A refuses.

Run it:

```sh
dotnet run MakeInvoice.cs
```
:::

::: sdk php
The script, [make-invoice.php](../files/php/make-invoice.php):

```php title="make-invoice.php"
<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use Lpdf\Engine\GeneratePdfOptions;
use Lpdf\Engine\InvoiceFormat;
use Lpdf\L;
use Lpdf\LCrossIndustryInvoice;

// The invoice's XML, as your accounting software wrote it. Any file name works.
$invoiceXml = file_get_contents('in/invoice-2026-0412.xml');

// How values are written on the page: the language's own formatters, and the words for the codes.
$codeNames = [
    'typeCode'   => [380 => 'Invoice', 381 => 'Credit note'],
    'lines.unit' => ['H87' => 'pcs', 'KGM' => 'kg'],
];
$format = new InvoiceFormat(
    date: fn (string $value): string => (new DateTimeImmutable($value))->format('j F Y'),
    amount: fn (string $value): string => number_format((float) $value, 2),
    code: fn (string $value, string $entryName): string => $codeNames[$entryName][$value] ?? $value,
);

$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), file_get_contents('invoice-template.xml'), new GeneratePdfOptions(
    invoiceXml: $invoiceXml,
    format: $format,
    data: ['note' => 'Payable within 30 days, by bank transfer.'],
    createdOn: date('c'),
));

file_put_contents('invoice-2026-0412.pdf', $pdf);
```

Run it:

```sh
php make-invoice.php
```
:::

For a folder of invoices, call it once for each XML, with the same template. A second template, for another look or another language, is another file: the code stays the same.

## 3. The same page in code

A template is a file a designer can change without code. If you prefer code, build the same page with the `L` builders: the call that makes the PDF is the same, and you give it a document in place of the template.

Builders have no binding attributes, so the values come from code. The invoice's values are read from the XML as plain data, a list is a loop over an array, and an optional line is an `if`. The note is a variable here, where the template took it as `data`.

::: sdk js
The script, [make-invoice-code.mjs](../files/node/make-invoice-code.mjs):

```javascript title="make-invoice-code.mjs"
import { L, NoAttr, LCrossIndustryInvoice } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

// The invoice's XML, as your accounting software wrote it. Any file name works.
const invoiceXml = readFileSync('in/invoice-2026-0412.xml')

// How values are written on the page: the language's own formatters, and the words for the codes.
const codeNames = {
    'typeCode':   { 380: 'Invoice', 381: 'Credit note' },
    'lines.unit': { H87: 'pcs', KGM: 'kg' },
}
const format = {
    date:   (value) => new Date(value).toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' }),
    amount: (value) => Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2 }),
    code:   (value, entryName) => codeNames[entryName]?.[value] ?? value,
}

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
const invoice = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, { format })
const note = 'Payable within 30 days, by bank transfer.'
const { seller, buyer, totals } = invoice

// Attributes used more than once.
const muted      = { fontSize: '9pt', color: '#5b6475' }
const mutedRight = { fontSize: '9pt', color: '#5b6475', align: 'right' }
const right      = { align: 'right' }
const title      = { fontSize: '16pt', color: '#1763cf' }
const total      = { fontSize: '14pt' }

const doc = L.document({
    size: 'a4',
    font: 'body',
    assets: {
        fonts: [{ name: 'body', src: 'fonts/SourceSans3-Regular.otf' }],
        images: [{ name: 'logo', src: 'logo.png' }],
    },
    meta: { title: 'Invoice', author: 'Northwind Paper SAS', lang: 'en' },
}, [
    L.section(NoAttr, [
        L.layout({ margin: '48pt' }, [
            L.column({ gap: 'l' }, [
                L.row({ align: 'end' }, [
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.img({ name: 'logo', width: '130pt' }),
                        L.text({ fontSize: '20pt' }, [seller.name]),
                        L.text(muted, [seller.street]),
                        L.row({ gap: 'xs' }, [L.text(muted, [seller.postcode]), L.text(muted, [seller.city])]),
                        L.row({ gap: 'xs' }, [L.text(muted, ['VAT']), L.text(muted, [seller.vatId])]),
                    ]),
                    L.row({ gap: 'xs' }, [L.text(title, [invoice.typeCode]), L.text(title, [invoice.number])]),
                ]),
                L.divider({ color: '#dde3ed', thickness: '0.5pt' }),
                L.row({ gap: 'l' }, [
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.text(muted, ['Billed to']),
                        L.text(NoAttr, [buyer.name]),
                        L.text(NoAttr, [buyer.street]),
                        L.row({ gap: 'xs' }, [L.text(NoAttr, [buyer.postcode]), L.text(NoAttr, [buyer.city])]),
                    ]),
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.text(muted, ['Issued · Due']),
                        L.text(NoAttr, [invoice.issued]),
                        // A list is a map over an array: one line for each payment term.
                        ...invoice.paymentTerms.map((term) => L.text(NoAttr, [term.due])),
                    ]),
                ]),
                L.table({ cols: '4fr 1fr 1fr 1fr 1fr 1fr' }, [
                    L.thead(NoAttr, [
                        L.td(NoAttr, [L.text(muted, ['Item'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['Qty'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['Unit'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['Price'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['VAT %'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['Amount'])]),
                    ]),
                    ...invoice.lines.map((line) => L.tr(NoAttr, [
                        L.td(NoAttr, [L.text(NoAttr, [line.name])]),
                        L.td(NoAttr, [L.text(right, [line.quantity])]),
                        L.td(NoAttr, [L.text(right, [line.unit])]),
                        L.td(NoAttr, [L.text(right, [line.unitPrice])]),
                        L.td(NoAttr, [L.text(right, [line.vatRate])]),
                        L.td(NoAttr, [L.text(right, [line.net])]),
                    ])),
                ]),
                L.divider({ color: '#dde3ed', thickness: '0.5pt' }),
                L.table({ cols: '1fr 1fr 1fr' }, [
                    L.thead(NoAttr, [
                        L.td(NoAttr, [L.text(muted, ['VAT rate (%)'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['Basis'])]),
                        L.td(NoAttr, [L.text(mutedRight, ['VAT'])]),
                    ]),
                    ...invoice.taxes.map((tax) => L.tr(NoAttr, [
                        L.td(NoAttr, [L.text(NoAttr, [tax.rate])]),
                        L.td(NoAttr, [L.text(right, [tax.basis])]),
                        L.td(NoAttr, [L.text(right, [tax.amount])]),
                    ])),
                ]),
                L.column({ gap: 'xs', align: 'end' }, [
                    L.row({ gap: 'xs' }, [L.text(NoAttr, ['VAT']), L.text(NoAttr, [totals.vat]), L.text(NoAttr, [totals.currency])]),
                    // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                    ...(totals.vatInTaxCurrency ? [L.row({ gap: 'xs' }, [
                        L.text(muted, ['VAT in']),
                        L.text(muted, [totals.taxCurrency]),
                        L.text(muted, [totals.vatInTaxCurrency]),
                    ])] : []),
                    L.row({ gap: 'xs' }, [L.text(total, ['Total']), L.text(total, [totals.gross]), L.text(total, [totals.currency])]),
                ]),
                ...(note ? [L.text(muted, [note])] : []),
            ]),
        ]),
    ]),
])

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), doc, { invoiceXml, createdOn: new Date().toISOString() })

writeFileSync('invoice-2026-0412-code.pdf', pdf)
```

Run it:

```sh
node make-invoice-code.mjs
```

It writes `invoice-2026-0412-code.pdf`, which renders the same page as step 2's file.

| In the page | Template | Builders |
|---|---|---|
| An invoice value | `data-value="invoice:seller.name"` | `seller.name` |
| A list | `<tr data-source="invoice:lines">` | `invoice.lines.map((line) => L.tr(…))` |
| An optional line | `data-if="invoice:totals.vatInTaxCurrency"` | `...(totals.vatInTaxCurrency ? [L.row(…)] : [])` |
| The logo | `<img name="logo" width="130pt"/>`, with `<image name="logo" src="logo.png"/>` in `<assets>` | `L.img({ name: 'logo', width: '130pt' })`, with `images: [{ name: 'logo', src: 'logo.png' }]` in `assets` |
| The note | `data` of the call | a variable |
| The look | an XML file | code |
:::

::: sdk python
The script, [make_invoice_code.py](../files/python/make_invoice_code.py):

```python title="make_invoice_code.py"
from datetime import UTC, date, datetime
from decimal import Decimal
from pathlib import Path

from lpdf import (
    ColumnAttr,
    DividerAttr,
    DocumentAssets,
    DocumentAttr,
    DocumentMeta,
    FontAttr,
    ImageAttr,
    ImgAttr,
    InvoiceFormat,
    L,
    LayoutAttr,
    LCrossIndustryInvoice,
    NoAttr,
    RowAttr,
    TableAttr,
    TextAttr,
)

# The invoice's XML, as your accounting software wrote it. Any file name works.
invoice_xml = Path("in/invoice-2026-0412.xml").read_bytes()

# How values are written on the page: the language's own formatters, and the words for the codes.
code_names = {
    "typeCode": {"380": "Invoice", "381": "Credit note"},
    "lines.unit": {"H87": "pcs", "KGM": "kg"},
}

invoice_format = InvoiceFormat(
    # The day has no leading zero. The month is in English, unless the program sets a locale.
    date=lambda value, _: "{0.day} {0:%B %Y}".format(date.fromisoformat(value)),
    amount=lambda value, _: f"{Decimal(value):,.2f}",
    code=lambda value, entry_name: code_names.get(entry_name, {}).get(value, value),
)

# The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
invoice = LCrossIndustryInvoice.extract_invoice_data(invoice_xml, format=invoice_format)
note = "Payable within 30 days, by bank transfer."
seller, buyer, totals = invoice["seller"], invoice["buyer"], invoice["totals"]

# Attributes used more than once.
muted = TextAttr(font_size="9pt", color="#5b6475")
muted_right = TextAttr(font_size="9pt", color="#5b6475", align="right")
right = TextAttr(align="right")
title = TextAttr(font_size="16pt", color="#1763cf")
total = TextAttr(font_size="14pt")

doc = L.document(DocumentAttr(
    size="a4",
    font="body",
    assets=DocumentAssets(
        fonts=[FontAttr(name="body", src="fonts/SourceSans3-Regular.otf")],
        images=[ImageAttr(name="logo", src="logo.png")],
    ),
    meta=DocumentMeta(title="Invoice", author="Northwind Paper SAS", lang="en"),
), [
    L.section(NoAttr, [
        L.layout(LayoutAttr(margin="48pt"), [
            L.column(ColumnAttr(gap="l"), [
                L.row(RowAttr(align="end"), [
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.img(ImgAttr(name="logo", width="130pt")),
                        L.text(TextAttr(font_size="20pt"), [seller["name"]]),
                        L.text(muted, [seller["street"]]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(muted, [seller["postcode"]]),
                            L.text(muted, [seller["city"]]),
                        ]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(muted, ["VAT"]),
                            L.text(muted, [seller["vatId"]]),
                        ]),
                    ]),
                    L.row(RowAttr(gap="xs"), [
                        L.text(title, [invoice["typeCode"]]),
                        L.text(title, [invoice["number"]]),
                    ]),
                ]),
                L.divider(DividerAttr(color="#dde3ed", thickness="0.5pt")),
                L.row(RowAttr(gap="l"), [
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.text(muted, ["Billed to"]),
                        L.text(NoAttr, [buyer["name"]]),
                        L.text(NoAttr, [buyer["street"]]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(NoAttr, [buyer["postcode"]]),
                            L.text(NoAttr, [buyer["city"]]),
                        ]),
                    ]),
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.text(muted, ["Issued · Due"]),
                        L.text(NoAttr, [invoice["issued"]]),
                        # A list is a comprehension: one line for each payment term.
                        *[L.text(NoAttr, [term["due"]]) for term in invoice["paymentTerms"]],
                    ]),
                ]),
                L.table(TableAttr(cols="4fr 1fr 1fr 1fr 1fr 1fr"), [
                    L.thead(NoAttr, [
                        L.td(NoAttr, [L.text(muted, ["Item"])]),
                        L.td(NoAttr, [L.text(muted_right, ["Qty"])]),
                        L.td(NoAttr, [L.text(muted_right, ["Unit"])]),
                        L.td(NoAttr, [L.text(muted_right, ["Price"])]),
                        L.td(NoAttr, [L.text(muted_right, ["VAT %"])]),
                        L.td(NoAttr, [L.text(muted_right, ["Amount"])]),
                    ]),
                    *[L.tr(NoAttr, [
                        L.td(NoAttr, [L.text(NoAttr, [line["name"]])]),
                        L.td(NoAttr, [L.text(right, [line["quantity"]])]),
                        L.td(NoAttr, [L.text(right, [line["unit"]])]),
                        L.td(NoAttr, [L.text(right, [line["unitPrice"]])]),
                        L.td(NoAttr, [L.text(right, [line["vatRate"]])]),
                        L.td(NoAttr, [L.text(right, [line["net"]])]),
                    ]) for line in invoice["lines"]],
                ]),
                L.divider(DividerAttr(color="#dde3ed", thickness="0.5pt")),
                L.table(TableAttr(cols="1fr 1fr 1fr"), [
                    L.thead(NoAttr, [
                        L.td(NoAttr, [L.text(muted, ["VAT rate (%)"])]),
                        L.td(NoAttr, [L.text(muted_right, ["Basis"])]),
                        L.td(NoAttr, [L.text(muted_right, ["VAT"])]),
                    ]),
                    *[L.tr(NoAttr, [
                        L.td(NoAttr, [L.text(NoAttr, [tax["rate"]])]),
                        L.td(NoAttr, [L.text(right, [tax["basis"]])]),
                        L.td(NoAttr, [L.text(right, [tax["amount"]])]),
                    ]) for tax in invoice["taxes"]],
                ]),
                L.column(ColumnAttr(gap="xs", align="end"), [
                    L.row(RowAttr(gap="xs"), [
                        L.text(NoAttr, ["VAT"]),
                        L.text(NoAttr, [totals["vat"]]),
                        L.text(NoAttr, [totals["currency"]]),
                    ]),
                    # An optional line is an if: the VAT in the tax currency, when there is one.
                    *([L.row(RowAttr(gap="xs"), [
                        L.text(muted, ["VAT in"]),
                        L.text(muted, [totals["taxCurrency"]]),
                        L.text(muted, [totals["vatInTaxCurrency"]]),
                    ])] if "vatInTaxCurrency" in totals else []),
                    L.row(RowAttr(gap="xs"), [
                        L.text(total, ["Total"]),
                        L.text(total, [totals["gross"]]),
                        L.text(total, [totals["currency"]]),
                    ]),
                ]),
                *([L.text(muted, [note])] if note else []),
            ]),
        ]),
    ]),
])

# Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
pdf = LCrossIndustryInvoice.generate_pdf(
    L.engine(), doc, invoice_xml=invoice_xml, created_on=datetime.now(UTC).isoformat()
)

Path("invoice-2026-0412-code.pdf").write_bytes(pdf)
```

Run it:

```sh
python make_invoice_code.py
```

It writes `invoice-2026-0412-code.pdf`, which renders the same page as step 2's file.

| In the page | Template | Builders |
|---|---|---|
| An invoice value | `data-value="invoice:seller.name"` | `seller["name"]` |
| A list | `<tr data-source="invoice:lines">` | `[L.tr(…) for line in invoice["lines"]]` |
| An optional line | `data-if="invoice:totals.vatInTaxCurrency"` | `*([L.row(…)] if "vatInTaxCurrency" in totals else [])` |
| The logo | `<img name="logo" width="130pt"/>`, with `<image name="logo" src="logo.png"/>` in `<assets>` | `L.img(ImgAttr(name="logo", width="130pt"))`, with `images=[ImageAttr(name="logo", src="logo.png")]` in the assets |
| The note | `data` of the call | a variable |
| The look | an XML file | code |
:::

::: sdk java
The script, [MakeInvoiceCode.java](../files/java/MakeInvoiceCode.java):

```java title="MakeInvoiceCode.java"
import static io.lpdf.L.NoAttr;

import io.lpdf.ColumnAttr;
import io.lpdf.DividerAttr;
import io.lpdf.DocumentAssets;
import io.lpdf.DocumentAttr;
import io.lpdf.DocumentMeta;
import io.lpdf.EngineOptions;
import io.lpdf.ExtractInvoiceDataOptions;
import io.lpdf.FontAttr;
import io.lpdf.GeneratePdfOptions;
import io.lpdf.ImageAttr;
import io.lpdf.ImgAttr;
import io.lpdf.InvoiceFormat;
import io.lpdf.L;
import io.lpdf.LCrossIndustryInvoice;
import io.lpdf.LayoutAttr;
import io.lpdf.Node;
import io.lpdf.RowAttr;
import io.lpdf.TableAttr;
import io.lpdf.TextAttr;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class MakeInvoiceCode {
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        // The invoice's XML, as your accounting software wrote it. Any file name works.
        byte[] invoiceXml = Files.readAllBytes(Path.of("in/invoice-2026-0412.xml"));

        // How values are written on the page: the language's own formatters, and the words for the codes.
        var dateFormat = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.UK);
        var amountFormat = NumberFormat.getNumberInstance(Locale.UK);
        amountFormat.setMinimumFractionDigits(2);
        Map<String, Map<String, String>> codeNames = Map.of(
            "typeCode", Map.of("380", "Invoice", "381", "Credit note"),
            "lines.unit", Map.of("H87", "pcs", "KGM", "kg"));
        var format = new InvoiceFormat()
            .date((value, entryName) -> LocalDate.parse(value).format(dateFormat))
            .amount((value, entryName) -> amountFormat.format(new BigDecimal(value)))
            .code((value, entryName) -> codeNames.getOrDefault(entryName, Map.of()).getOrDefault(value, value));

        // The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
        var invoice = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, new ExtractInvoiceDataOptions().format(format));
        var note = "Payable within 30 days, by bank transfer.";
        var seller = (Map<String, Object>) invoice.get("seller");
        var buyer = (Map<String, Object>) invoice.get("buyer");
        var totals = (Map<String, Object>) invoice.get("totals");
        var paymentTerms = (List<Map<String, Object>>) invoice.get("paymentTerms");
        var lines = (List<Map<String, Object>>) invoice.get("lines");
        var taxes = (List<Map<String, Object>>) invoice.get("taxes");

        // Attributes used more than once.
        var muted = new TextAttr().fontSize("9pt").color("#5b6475");
        var mutedRight = new TextAttr().fontSize("9pt").color("#5b6475").align("right");
        var right = new TextAttr().align("right");
        var title = new TextAttr().fontSize("16pt").color("#1763cf");
        var total = new TextAttr().fontSize("14pt");

        var doc = L.document(
            new DocumentAttr()
                .size("a4")
                .font("body")
                .assets(new DocumentAssets()
                    .fonts(List.of(new FontAttr().name("body").src("fonts/SourceSans3-Regular.otf")))
                    .images(List.of(new ImageAttr().name("logo").src("logo.png"))))
                .meta(new DocumentMeta().title("Invoice").author("Northwind Paper SAS").lang("en")),
            List.of(
                L.section(NoAttr, List.of(
                    L.layout(new LayoutAttr().margin("48pt"), List.of(
                        L.column(new ColumnAttr().gap("l"), nodes(
                            L.row(new RowAttr().align("end"), List.of(
                                L.column(new ColumnAttr().width("fill").gap("xs"), List.of(
                                    L.img(new ImgAttr().name("logo").width("130pt")),
                                    L.text(new TextAttr().fontSize("20pt"), List.of(seller.get("name"))),
                                    L.text(muted, List.of(seller.get("street"))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(muted, List.of(seller.get("postcode"))), L.text(muted, List.of(seller.get("city"))))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(muted, List.of("VAT")), L.text(muted, List.of(seller.get("vatId")))))
                                )),
                                L.row(new RowAttr().gap("xs"), List.of(L.text(title, List.of(invoice.get("typeCode"))), L.text(title, List.of(invoice.get("number")))))
                            )),
                            L.divider(new DividerAttr().color("#dde3ed").thickness("0.5pt")),
                            L.row(new RowAttr().gap("l"), List.of(
                                L.column(new ColumnAttr().width("fill").gap("xs"), List.of(
                                    L.text(muted, List.of("Billed to")),
                                    L.text(NoAttr, List.of(buyer.get("name"))),
                                    L.text(NoAttr, List.of(buyer.get("street"))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(NoAttr, List.of(buyer.get("postcode"))), L.text(NoAttr, List.of(buyer.get("city")))))
                                )),
                                L.column(new ColumnAttr().width("fill").gap("xs"), nodes(
                                    L.text(muted, List.of("Issued · Due")),
                                    L.text(NoAttr, List.of(invoice.get("issued"))),
                                    // A list is a map over a list: one line for each payment term.
                                    paymentTerms.stream().map(term -> L.text(NoAttr, List.of(term.get("due")))).toList()
                                ))
                            )),
                            L.table(new TableAttr().cols("4fr 1fr 1fr 1fr 1fr 1fr"), nodes(
                                L.thead(NoAttr, List.of(
                                    L.td(NoAttr, List.of(L.text(muted, List.of("Item")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("Qty")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("Unit")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("Price")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("VAT %")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("Amount"))))
                                )),
                                lines.stream().map(line -> L.tr(NoAttr, List.of(
                                    L.td(NoAttr, List.of(L.text(NoAttr, List.of(line.get("name"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(line.get("quantity"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(line.get("unit"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(line.get("unitPrice"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(line.get("vatRate"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(line.get("net")))))
                                ))).toList()
                            )),
                            L.divider(new DividerAttr().color("#dde3ed").thickness("0.5pt")),
                            L.table(new TableAttr().cols("1fr 1fr 1fr"), nodes(
                                L.thead(NoAttr, List.of(
                                    L.td(NoAttr, List.of(L.text(muted, List.of("VAT rate (%)")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("Basis")))),
                                    L.td(NoAttr, List.of(L.text(mutedRight, List.of("VAT"))))
                                )),
                                taxes.stream().map(tax -> L.tr(NoAttr, List.of(
                                    L.td(NoAttr, List.of(L.text(NoAttr, List.of(tax.get("rate"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(tax.get("basis"))))),
                                    L.td(NoAttr, List.of(L.text(right, List.of(tax.get("amount")))))
                                ))).toList()
                            )),
                            L.column(new ColumnAttr().gap("xs").align("end"), nodes(
                                L.row(new RowAttr().gap("xs"), List.of(L.text(NoAttr, List.of("VAT")), L.text(NoAttr, List.of(totals.get("vat"))), L.text(NoAttr, List.of(totals.get("currency"))))),
                                // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                                totals.containsKey("vatInTaxCurrency") ? List.of(L.row(new RowAttr().gap("xs"), List.of(
                                    L.text(muted, List.of("VAT in")),
                                    L.text(muted, List.of(totals.get("taxCurrency"))),
                                    L.text(muted, List.of(totals.get("vatInTaxCurrency")))
                                ))) : List.of(),
                                L.row(new RowAttr().gap("xs"), List.of(L.text(total, List.of("Total")), L.text(total, List.of(totals.get("gross"))), L.text(total, List.of(totals.get("currency")))))
                            )),
                            note.isEmpty() ? List.of() : List.of(L.text(muted, List.of(note)))
                        ))
                    ))
                ))
            ));

        // Java reads the document's font and image files, each a `src`, only through the engine.
        var engine = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))));

        // Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
        byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, doc,
            new GeneratePdfOptions().invoiceXml(invoiceXml).createdOn(Instant.now().toString()));

        Files.write(Path.of("invoice-2026-0412-code.pdf"), pdf);
    }

    // The children of a node from single nodes and lists of nodes together, as the spread `...list` does in JavaScript.
    private static List<Node> nodes(Object... parts) {
        var children = new ArrayList<Node>();
        for (var part : parts) {
            if (part instanceof Collection<?> many) {
                many.forEach(one -> children.add((Node) one));
            } else {
                children.add((Node) part);
            }
        }
        return children;
    }
}
```

Run it:

```sh
mvn -q compile exec:java -Dexec.mainClass=MakeInvoiceCode
```

It writes `invoice-2026-0412-code.pdf`, which renders the same page as step 2's file.

Java has no spread, so the script's own `nodes(…)` joins single nodes and lists of nodes into the children of an element.

| In the page | Template | Builders |
|---|---|---|
| An invoice value | `data-value="invoice:seller.name"` | `seller.get("name")` |
| A list | `<tr data-source="invoice:lines">` | `lines.stream().map(line -> L.tr(…)).toList()` |
| An optional line | `data-if="invoice:totals.vatInTaxCurrency"` | `totals.containsKey("vatInTaxCurrency") ? List.of(L.row(…)) : List.of()` |
| The logo | `<img name="logo" width="130pt"/>`, with `<image name="logo" src="logo.png"/>` in `<assets>` | `L.img(new ImgAttr().name("logo").width("130pt"))`, with `.images(List.of(new ImageAttr().name("logo").src("logo.png")))` in the assets |
| The note | `data` of the call | a variable |
| The look | an XML file | code |
:::

::: sdk dotnet
The script, [MakeInvoiceCode.cs](../files/dotnet/MakeInvoiceCode.cs):

```csharp title="MakeInvoiceCode.cs"
#:package Lpdfio.Lpdf@0.36.0
#:property PublishAot=false

using System.Globalization;
using System.Text.Json.Nodes;
using Lpdf;
using Lpdf.Engine;
using Lpdf.Layout;
using static Lpdf.L;

// The invoice's XML, as your accounting software wrote it. Any file name works.
var invoiceXml = File.ReadAllBytes("in/invoice-2026-0412.xml");

// How values are written on the page: the language's own formatters, and the words for the codes.
var british = CultureInfo.GetCultureInfo("en-GB");
var codeNames = new Dictionary<string, Dictionary<string, string>>
{
    ["typeCode"] = new() { ["380"] = "Invoice", ["381"] = "Credit note" },
    ["lines.unit"] = new() { ["H87"] = "pcs", ["KGM"] = "kg" },
};
var format = new InvoiceFormat
{
    Date = (value, _) => DateOnly.Parse(value, CultureInfo.InvariantCulture).ToString("d MMMM yyyy", british),
    Amount = (value, _) => decimal.Parse(value, CultureInfo.InvariantCulture).ToString("N2", british),
    Code = (value, entryName) => codeNames.GetValueOrDefault(entryName)?.GetValueOrDefault(value) ?? value,
};

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
var invoice = LCrossIndustryInvoice.ExtractInvoiceData(invoiceXml, new() { Format = format });
var note = "Payable within 30 days, by bank transfer.";
var seller = invoice["seller"];
var buyer = invoice["buyer"];
var totals = invoice["totals"];

// A value is text, a group an object, a list an array. One the invoice lacks is "", or an empty list.
string Value(JsonNode? group, string name) => group?[name]?.GetValue<string>() ?? "";
IEnumerable<JsonNode?> Items(JsonNode? group, string name) => group?[name]?.AsArray() ?? [];

// Attributes used more than once.
var muted = new TextAttr { FontSize = "9pt", Color = "#5b6475" };
var mutedRight = new TextAttr { FontSize = "9pt", Color = "#5b6475", Align = "right" };
var right = new TextAttr { Align = "right" };
var title = new TextAttr { FontSize = "16pt", Color = "#1763cf" };
var total = new TextAttr { FontSize = "14pt" };

var doc = L.Document(new()
{
    Size = "a4",
    Font = "body",
    Assets = new(
        Fonts: [new() { Name = "body", Src = "fonts/SourceSans3-Regular.otf" }],
        Images: [new() { Name = "logo", Src = "logo.png" }]),
    Meta = new(Title: "Invoice", Author: "Northwind Paper SAS", Lang: "en"),
}, [
    L.Section(NoAttr, [
        L.Layout(new() { Margin = "48pt" }, [
            L.Column(new() { Gap = "l" }, [
                L.Row(new() { Align = "end" }, [
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Img(new() { Name = "logo", Width = "130pt" }),
                        L.Text(new() { FontSize = "20pt" }, [Value(seller, "name")]),
                        L.Text(muted, [Value(seller, "street")]),
                        L.Row(new() { Gap = "xs" }, [L.Text(muted, [Value(seller, "postcode")]), L.Text(muted, [Value(seller, "city")])]),
                        L.Row(new() { Gap = "xs" }, [L.Text(muted, ["VAT"]), L.Text(muted, [Value(seller, "vatId")])]),
                    ]),
                    L.Row(new() { Gap = "xs" }, [L.Text(title, [Value(invoice, "typeCode")]), L.Text(title, [Value(invoice, "number")])]),
                ]),
                L.Divider(new() { Color = "#dde3ed", Thickness = "0.5pt" }),
                L.Row(new() { Gap = "l" }, [
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Text(muted, ["Billed to"]),
                        L.Text(NoAttr, [Value(buyer, "name")]),
                        L.Text(NoAttr, [Value(buyer, "street")]),
                        L.Row(new() { Gap = "xs" }, [L.Text(NoAttr, [Value(buyer, "postcode")]), L.Text(NoAttr, [Value(buyer, "city")])]),
                    ]),
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Text(muted, ["Issued · Due"]),
                        L.Text(NoAttr, [Value(invoice, "issued")]),
                        // A list is a Select over an array: one line for each payment term.
                        .. Items(invoice, "paymentTerms").Select(term => L.Text(NoAttr, [Value(term, "due")])),
                    ]),
                ]),
                L.Table(new() { Cols = "4fr 1fr 1fr 1fr 1fr 1fr" }, [
                    L.Thead(NoAttr, [
                        L.Td(NoAttr, [L.Text(muted, ["Item"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["Qty"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["Unit"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["Price"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["VAT %"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["Amount"])]),
                    ]),
                    .. Items(invoice, "lines").Select(line => L.Tr(NoAttr, [
                        L.Td(NoAttr, [L.Text(NoAttr, [Value(line, "name")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(line, "quantity")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(line, "unit")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(line, "unitPrice")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(line, "vatRate")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(line, "net")])]),
                    ])),
                ]),
                L.Divider(new() { Color = "#dde3ed", Thickness = "0.5pt" }),
                L.Table(new() { Cols = "1fr 1fr 1fr" }, [
                    L.Thead(NoAttr, [
                        L.Td(NoAttr, [L.Text(muted, ["VAT rate (%)"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["Basis"])]),
                        L.Td(NoAttr, [L.Text(mutedRight, ["VAT"])]),
                    ]),
                    .. Items(invoice, "taxes").Select(tax => L.Tr(NoAttr, [
                        L.Td(NoAttr, [L.Text(NoAttr, [Value(tax, "rate")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(tax, "basis")])]),
                        L.Td(NoAttr, [L.Text(right, [Value(tax, "amount")])]),
                    ])),
                ]),
                L.Column(new() { Gap = "xs", Align = "end" }, [
                    L.Row(new() { Gap = "xs" }, [L.Text(NoAttr, ["VAT"]), L.Text(NoAttr, [Value(totals, "vat")]), L.Text(NoAttr, [Value(totals, "currency")])]),
                    // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                    .. (Value(totals, "vatInTaxCurrency") != "" ? (Node[])[L.Row(new() { Gap = "xs" }, [
                        L.Text(muted, ["VAT in"]),
                        L.Text(muted, [Value(totals, "taxCurrency")]),
                        L.Text(muted, [Value(totals, "vatInTaxCurrency")]),
                    ])] : []),
                    L.Row(new() { Gap = "xs" }, [L.Text(total, ["Total"]), L.Text(total, [Value(totals, "gross")]), L.Text(total, [Value(totals, "currency")])]),
                ]),
                .. (note != "" ? (Node[])[L.Text(muted, [note])] : []),
            ]),
        ]),
    ]),
]);

// The engine reads the font's and the image's src through SrcFallback, which here reads the file from disk.
using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
var pdf = LCrossIndustryInvoice.GeneratePdf(engine, doc, new() { InvoiceXml = invoiceXml, CreatedOn = DateTimeOffset.Now.ToString("o") });

File.WriteAllBytes("invoice-2026-0412-code.pdf", pdf);
```

`ExtractInvoiceData` returns a `JsonObject`. `Value` and `Items`, two small functions in the script, read a value or a list from it.

Run it:

```sh
dotnet run MakeInvoiceCode.cs
```

It writes `invoice-2026-0412-code.pdf`, which renders the same page as step 2's file.

| In the page | Template | Builders |
|---|---|---|
| An invoice value | `data-value="invoice:seller.name"` | `Value(seller, "name")` |
| A list | `<tr data-source="invoice:lines">` | `.. Items(invoice, "lines").Select(line => L.Tr(…))` |
| An optional line | `data-if="invoice:totals.vatInTaxCurrency"` | `.. (Value(totals, "vatInTaxCurrency") != "" ? (Node[])[L.Row(…)] : [])` |
| The logo | `<img name="logo" width="130pt"/>`, with `<image name="logo" src="logo.png"/>` in `<assets>` | `L.Img(new() { Name = "logo", Width = "130pt" })`, with `Images: [new() { Name = "logo", Src = "logo.png" }]` in the assets |
| The note | `Data` of the call | a variable |
| The look | an XML file | code |
:::

::: sdk php
The script, [make-invoice-code.php](../files/php/make-invoice-code.php):

```php title="make-invoice-code.php"
<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use Lpdf\Engine\ExtractInvoiceDataOptions;
use Lpdf\Engine\GeneratePdfOptions;
use Lpdf\Engine\InvoiceFormat;
use Lpdf\Kit\DocumentAssets;
use Lpdf\Kit\DocumentAttr;
use Lpdf\Kit\DocumentMeta;
use Lpdf\Kit\FontAttr;
use Lpdf\Kit\ImageAttr;
use Lpdf\Kit\LayoutAttr;
use Lpdf\L;
use Lpdf\LCrossIndustryInvoice;
use Lpdf\Layout\ColumnAttr;
use Lpdf\Layout\DividerAttr;
use Lpdf\Layout\ImgAttr;
use Lpdf\Layout\RowAttr;
use Lpdf\Layout\TableAttr;
use Lpdf\Layout\TextAttr;
use const Lpdf\NoAttr;

// The invoice's XML, as your accounting software wrote it. Any file name works.
$invoiceXml = file_get_contents('in/invoice-2026-0412.xml');

// How values are written on the page: the language's own formatters, and the words for the codes.
$codeNames = [
    'typeCode'   => [380 => 'Invoice', 381 => 'Credit note'],
    'lines.unit' => ['H87' => 'pcs', 'KGM' => 'kg'],
];
$format = new InvoiceFormat(
    date: fn (string $value): string => (new DateTimeImmutable($value))->format('j F Y'),
    amount: fn (string $value): string => number_format((float) $value, 2),
    code: fn (string $value, string $entryName): string => $codeNames[$entryName][$value] ?? $value,
);

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
$invoice = LCrossIndustryInvoice::extractInvoiceData($invoiceXml, new ExtractInvoiceDataOptions(format: $format));
$note = 'Payable within 30 days, by bank transfer.';
['seller' => $seller, 'buyer' => $buyer, 'totals' => $totals] = $invoice;

// Attributes used more than once.
$muted      = new TextAttr(fontSize: '9pt', color: '#5b6475');
$mutedRight = new TextAttr(fontSize: '9pt', color: '#5b6475', align: 'right');
$right      = new TextAttr(align: 'right');
$title      = new TextAttr(fontSize: '16pt', color: '#1763cf');
$total      = new TextAttr(fontSize: '14pt');

$doc = L::document(new DocumentAttr(
    size: 'a4',
    font: 'body',
    assets: new DocumentAssets(
        fonts: [new FontAttr(name: 'body', src: 'fonts/SourceSans3-Regular.otf')],
        images: [new ImageAttr(name: 'logo', src: 'logo.png')],
    ),
    meta: new DocumentMeta(title: 'Invoice', author: 'Northwind Paper SAS', lang: 'en'),
), [
    L::section(NoAttr, [
        L::layout(new LayoutAttr(margin: '48pt'), [
            L::column(new ColumnAttr(gap: 'l'), [
                L::row(new RowAttr(align: 'end'), [
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::img(new ImgAttr(name: 'logo', width: '130pt')),
                        L::text(new TextAttr(fontSize: '20pt'), [$seller['name']]),
                        L::text($muted, [$seller['street']]),
                        L::row(new RowAttr(gap: 'xs'), [L::text($muted, [$seller['postcode']]), L::text($muted, [$seller['city']])]),
                        L::row(new RowAttr(gap: 'xs'), [L::text($muted, ['VAT']), L::text($muted, [$seller['vatId']])]),
                    ]),
                    L::row(new RowAttr(gap: 'xs'), [L::text($title, [$invoice['typeCode']]), L::text($title, [$invoice['number']])]),
                ]),
                L::divider(new DividerAttr(color: '#dde3ed', thickness: '0.5pt')),
                L::row(new RowAttr(gap: 'l'), [
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::text($muted, ['Billed to']),
                        L::text(NoAttr, [$buyer['name']]),
                        L::text(NoAttr, [$buyer['street']]),
                        L::row(new RowAttr(gap: 'xs'), [L::text(NoAttr, [$buyer['postcode']]), L::text(NoAttr, [$buyer['city']])]),
                    ]),
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::text($muted, ['Issued · Due']),
                        L::text(NoAttr, [$invoice['issued']]),
                        // A list is a map over an array: one line for each payment term.
                        ...array_map(fn (array $term) => L::text(NoAttr, [$term['due']]), $invoice['paymentTerms']),
                    ]),
                ]),
                L::table(new TableAttr(cols: '4fr 1fr 1fr 1fr 1fr 1fr'), [
                    L::thead(NoAttr, [
                        L::td(NoAttr, [L::text($muted, ['Item'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['Qty'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['Unit'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['Price'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['VAT %'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['Amount'])]),
                    ]),
                    ...array_map(fn (array $line) => L::tr(NoAttr, [
                        L::td(NoAttr, [L::text(NoAttr, [$line['name']])]),
                        L::td(NoAttr, [L::text($right, [$line['quantity']])]),
                        L::td(NoAttr, [L::text($right, [$line['unit']])]),
                        L::td(NoAttr, [L::text($right, [$line['unitPrice']])]),
                        L::td(NoAttr, [L::text($right, [$line['vatRate']])]),
                        L::td(NoAttr, [L::text($right, [$line['net']])]),
                    ]), $invoice['lines']),
                ]),
                L::divider(new DividerAttr(color: '#dde3ed', thickness: '0.5pt')),
                L::table(new TableAttr(cols: '1fr 1fr 1fr'), [
                    L::thead(NoAttr, [
                        L::td(NoAttr, [L::text($muted, ['VAT rate (%)'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['Basis'])]),
                        L::td(NoAttr, [L::text($mutedRight, ['VAT'])]),
                    ]),
                    ...array_map(fn (array $tax) => L::tr(NoAttr, [
                        L::td(NoAttr, [L::text(NoAttr, [$tax['rate']])]),
                        L::td(NoAttr, [L::text($right, [$tax['basis']])]),
                        L::td(NoAttr, [L::text($right, [$tax['amount']])]),
                    ]), $invoice['taxes']),
                ]),
                L::column(new ColumnAttr(gap: 'xs', align: 'end'), [
                    L::row(new RowAttr(gap: 'xs'), [L::text(NoAttr, ['VAT']), L::text(NoAttr, [$totals['vat']]), L::text(NoAttr, [$totals['currency']])]),
                    // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                    ...(isset($totals['vatInTaxCurrency']) ? [L::row(new RowAttr(gap: 'xs'), [
                        L::text($muted, ['VAT in']),
                        L::text($muted, [$totals['taxCurrency']]),
                        L::text($muted, [$totals['vatInTaxCurrency']]),
                    ])] : []),
                    L::row(new RowAttr(gap: 'xs'), [L::text($total, ['Total']), L::text($total, [$totals['gross']]), L::text($total, [$totals['currency']])]),
                ]),
                ...($note !== '' ? [L::text($muted, [$note])] : []),
            ]),
        ]),
    ]),
]);

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), $doc, new GeneratePdfOptions(invoiceXml: $invoiceXml, createdOn: date('c')));

file_put_contents('invoice-2026-0412-code.pdf', $pdf);
```

Run it:

```sh
php make-invoice-code.php
```

It writes `invoice-2026-0412-code.pdf`, which renders the same page as step 2's file.

| In the page | Template | Builders |
|---|---|---|
| An invoice value | `data-value="invoice:seller.name"` | `$seller['name']` |
| A list | `<tr data-source="invoice:lines">` | `array_map(fn (array $line) => L::tr(…), $invoice['lines'])` |
| An optional line | `data-if="invoice:totals.vatInTaxCurrency"` | `...(isset($totals['vatInTaxCurrency']) ? [L::row(…)] : [])` |
| The logo | `<img name="logo" width="130pt"/>`, with `<image name="logo" src="logo.png"/>` in `<assets>` | `L::img(new ImgAttr(name: 'logo', width: '130pt'))`, with `images: [new ImageAttr(name: 'logo', src: 'logo.png')]` in the assets |
| The note | `data` of the call | a variable |
| The look | an XML file | code |
:::

## Check the result

Open `invoice-2026-0412.pdf` in Adobe Acrobat. A bar at the top says the file claims compliance with the PDF/A standard, and **View > Show/Hide > Navigation Panes > Standards** shows PDF/A-3B. **View > Show/Hide > Navigation Panes > Attachments** lists `factur-x.xml`. Other PDF readers list the attachments too.

Acrobat's Standards panel says "not yet verified": it reads what the file says about itself, and does not check it. Acrobat Pro's Preflight tool can check the PDF/A; the checker below checks that and the XML as well.

The [Mustang CLI](https://www.mustangproject.org/commandline/), an open-source Factur-X checker, checks the whole file: the PDF/A-3, the Factur-X metadata, and the XML against the rules of EN 16931. It needs Java 11 or later, and the file you download carries its version in its name, such as `Mustang-CLI-2.26.0.jar`.

```sh
java -jar Mustang-CLI.jar --action validate --source invoice-2026-0412.pdf
```

It prints a report in XML. For this guide's file, with Mustang CLI 2.26.0, the parts that matter are:

```xml
<pdf>ValidationResult [flavour=3b, totalAssertions=2012, assertions=[], isCompliant=true]
  <summary status="valid"/>
</pdf>
<xml>
  <warning type="4" …>BR-FR-10/BT-30 : Le SIREN du vendeur (ram:ID) est obligatoire …</warning>
  …
  <summary status="valid"/>
</xml>
<summary status="valid"/>
```

The PDF is valid PDF/A-3b and the XML is a valid EN 16931 invoice. The warnings come from national rules the checker also runs, the French ones of 2026 and Germany's XRechnung, which ask the sample's XML for more, such as the seller's SIREN number. They are about the XML, not the PDF: the next section says why.

## What Lpdf does, and what is yours

Lpdf reads the XML, fills the template, places the logo, embeds the font, writes the file as PDF/A-3, attaches the XML, and writes the Factur-X metadata that names its profile. The pages come from the XML, so the two can't disagree.

The XML's content is yours. Lpdf checks what reading it needs, and not its sums, its codes or the rules of EN 16931: check the XML your software writes with the Mustang CLI, or with the KoSIT validator, before you rely on it.

## Your own names

The names in the template come from Lpdf's default map, which has the values EN 16931 numbers but the parties' identifiers BT-29, BT-46, BT-60 and BT-71, what a line may hold several of, and an attached file's content: see [The default invoice map](https://lpdf.io/docs/invoice-map/). For names of your own, or a prefix in your language, such as `rechnung:verkaeufer.name`, start a map from the default map and pass it as `{{invoiceMap}}`.

::: sdk js
Start from `LCrossIndustryInvoice.defaultInvoiceMap()`. The values themselves, as plain data, are what `LCrossIndustryInvoice.extractInvoiceData(invoiceXml, { format })` returns, for a document built in code, as in step 3, or to name the output file.
:::

::: sdk python
Start from `LCrossIndustryInvoice.default_invoice_map()`, and pass your map as `invoice_map`. The values themselves, as plain data, are what `LCrossIndustryInvoice.extract_invoice_data(invoice_xml, format=invoice_format)` returns, for a document built in code, as in step 3, or to name the output file.
:::

::: sdk java
Start from `LCrossIndustryInvoice.defaultInvoiceMap()`, and pass your map as `invoiceMap` in `GeneratePdfOptions`. The values themselves, as plain data, are what `LCrossIndustryInvoice.extractInvoiceData(invoiceXml, new ExtractInvoiceDataOptions().format(format))` returns, as maps and lists, for a document built in code, as in step 3, or to name the output file.
:::

::: sdk dotnet
Start from `LCrossIndustryInvoice.DefaultInvoiceMap()`, which gives the map as XML text, and pass your map as `InvoiceMap` in the call's options. The values themselves, as plain data, are what `LCrossIndustryInvoice.ExtractInvoiceData(invoiceXml, new() { Format = format })` returns, for a document built in code, as in step 3, or to name the output file.
:::

::: sdk php
Start from `LCrossIndustryInvoice::defaultInvoiceMap()`. The values themselves, as plain data, are what `LCrossIndustryInvoice::extractInvoiceData($invoiceXml, new ExtractInvoiceDataOptions(format: $format))` returns, for a document built in code, as in step 3, or to name the output file.
:::

## When it fails

Each error says what is wrong. The ones a first invoice usually meets:

| The error says | What to change |
|---|---|
| `the invoice's profile is MINIMUM` or `BASIC WL` | Those profiles' XML is only a booking aid, without the lines the PDF shows, so the PDF can't be made from it. Ask your software for BASIC, EN 16931 or EXTENDED |
| `data-value="invoice:sellr.name": 'sellr' is not in the map` | A name in the template that the map doesn't have: the error lists the names it has there |
| `image 'logo' declared in <assets> but not loaded via loadImage()` | The image's file was not found: check the image's `src`, which is read from the folder you run in |
| `generatePdf makes the invoice a PDF/A-3b file: the text "…" is in Helvetica` | Declare a font in `<assets>` and set it with `font` on the document. When the error names your font and says its file was not loaded, check the font's `src`: it is read from the folder you run in |

::: sdk js
Leaving out `createdOn` stops the call with `generatePdf needs createdOn, which PDF/A requires`: pass it, as step 2 does.
:::

::: sdk python
Leaving out `created_on` is a `TypeError` before the engine runs: pass it, as step 2 does. The engine's own errors reach Python as an `EngineException`, whose message starts with `lpdf render error: `.
:::

::: sdk java
Leaving out `createdOn` stops the call with `generatePdf needs createdOn, which PDF/A requires`: pass it, as step 2 does.
:::

::: sdk dotnet
Leaving out `CreatedOn` does not compile, since it is a `required` member of `GeneratePdfOptions`: set it, as step 2 does.
:::

::: sdk php
Leaving out `createdOn` is an `ArgumentCountError`, since `GeneratePdfOptions` requires it: pass it, as step 2 does. The engine's own errors reach PHP with `lpdf render error: ` before the message.
:::

All of them are listed under [Factur-X / ZUGFeRD from the invoice XML, what it checks](https://lpdf.io/docs/cross-industry-invoice/#what-it-checks).

## Next

- [Factur-X / ZUGFeRD from the invoice XML](https://lpdf.io/docs/cross-industry-invoice/): the map, the format functions, a document built in code
- [Factur-X e-invoices](https://lpdf.io/docs/facturx/): attaching an XML you fill the pages for yourself, `facturx-strict`
- [PDF/A](https://lpdf.io/docs/pdfa/): the levels, and what a PDF/A file can't hold
- This guide in {{otherGuides}}
