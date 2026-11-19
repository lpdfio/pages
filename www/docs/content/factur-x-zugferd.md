# Factur-X / ZUGFeRD

Factur-X, called ZUGFeRD in Germany, is a hybrid e-invoice: a PDF/A-3 file whose pages are the invoice people read, carrying the same invoice as EN 16931 XML, which accounting software reads. France and Germany accept it as an electronic invoice. Factur-X and ZUGFeRD are one joint format, and Lpdf writes it as its spec, Factur-X 1.09.2 and ZUGFeRD 2.5.2, describes it: a PDF/A-3 document that carries an attachment named `factur-x.xml` is a Factur-X invoice.

There are two ways to make one. [From the invoice XML](#from-the-invoice-xml): your accounting software or an e-invoice library already writes the XML, and one call fills your template from it and makes the whole invoice. [Attach the XML yourself](#attach-the-xml-yourself): you fill the pages, and Lpdf attaches the XML and makes the PDF the spec asks for.

## From the invoice XML

`LCrossIndustryInvoice` makes a Factur-X / ZUGFeRD invoice from the invoice's XML, the EN 16931 file your accounting software or an e-invoice library already writes. One call reads the values out of the XML, fills your template with them, makes the file PDF/A-3 and attaches the XML. Your template only says how the invoice looks on paper.

The XML is a Cross Industry Invoice, the format every Factur-X and ZUGFeRD invoice carries, and an XRechnung in its CII form. Lpdf reads it and never writes it: a library of your language writes the XML, and the [Mustang CLI](https://www.mustangproject.org/commandline/) or the [KoSIT validator](https://github.com/itplr-kosit/validator) check all of it. To attach an XML you fill the pages for yourself, see [attach the XML yourself](#attach-the-xml-yourself).

### One call

`generatePdf` takes the engine, the template and the invoice's XML. The engine carries the fonts, the license key and the limits: the invoice is read, and the PDF rendered, each within its timeout and memory cap. In JavaScript, `LCrossIndustryInvoice` comes from `@lpdfio/lpdf`, not from `@lpdfio/lpdf/browser`.

::: sdk js

```javascript
import { L, LCrossIndustryInvoice } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), readFileSync('invoice-template.xml', 'utf8'), {
    invoiceXml: readFileSync('in/invoice-2026-0412.xml'),
    data: { note: 'Payable within 30 days, by bank transfer.' },
    createdOn: new Date().toISOString(),
})

writeFileSync('invoice-2026-0412.pdf', pdf)
```
:::

::: sdk python

```python
from datetime import datetime, timezone
from pathlib import Path
from lpdf import L, LCrossIndustryInvoice

pdf = LCrossIndustryInvoice.generate_pdf(
    L.engine(), Path('invoice-template.xml').read_text(encoding='utf-8'),
    invoice_xml=Path('in/invoice-2026-0412.xml').read_bytes(),
    data={'note': 'Payable within 30 days, by bank transfer.'},
    created_on=datetime.now(timezone.utc).isoformat(),
)

Path('invoice-2026-0412.pdf').write_bytes(pdf)
```
:::

::: sdk java

```java
import io.lpdf.EngineOptions;
import io.lpdf.GeneratePdfOptions;
import io.lpdf.L;
import io.lpdf.LCrossIndustryInvoice;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Map;

var engine = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))));
byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, Files.readString(Path.of("invoice-template.xml")),
    new GeneratePdfOptions()
        .invoiceXml(Files.readAllBytes(Path.of("in/invoice-2026-0412.xml")))
        .data(Map.of("note", "Payable within 30 days, by bank transfer."))
        .createdOn(Instant.now().toString()));

Files.write(Path.of("invoice-2026-0412.pdf"), pdf);
```

Java reads the font's `src` only through the engine's `srcFallback`: without it the font isn't embedded, which PDF/A refuses.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });
var pdf = LCrossIndustryInvoice.GeneratePdf(engine, File.ReadAllText("invoice-template.xml"), new()
{
    InvoiceXml = File.ReadAllBytes("in/invoice-2026-0412.xml"),
    Data = new { note = "Payable within 30 days, by bank transfer." },
    CreatedOn = DateTimeOffset.Now.ToString("o"),
});

File.WriteAllBytes("invoice-2026-0412.pdf", pdf);
```

C# reads the font's `src` only through the engine's `SrcFallback`: without it the font isn't embedded, which PDF/A refuses.
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\GeneratePdfOptions;
use Lpdf\L;
use Lpdf\LCrossIndustryInvoice;

$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), file_get_contents('invoice-template.xml'), new GeneratePdfOptions(
    invoiceXml: file_get_contents('in/invoice-2026-0412.xml'),
    createdOn: date('c'),
    data: ['note' => 'Payable within 30 days, by bank transfer.'],
));

file_put_contents('invoice-2026-0412.pdf', $pdf);
```
:::

The template binds the invoice's values under the prefix `invoice:`, and your own `data` without one. Inside a row that `data-source` repeats, a plain name is the row's item, as everywhere in [data binding](?p=data/binding).

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/SourceSans3-Regular.otf"/>
  </assets>
  <document size="a4" font="body">
    <meta title="Invoice" lang="en"/>
    <section>
      <layout margin="48pt">
        <column gap="l">
          <row align="end">
            <text font-size="20pt" width="fill" data-value="invoice:seller.name">Seller</text>
            <text font-size="16pt" data-value="invoice:number">0000</text>
          </row>
          <text data-value="invoice:buyer.name">Buyer</text>
          <table cols="4fr 1fr 1fr">
            <tr data-source="invoice:lines">
              <td><text data-value="name">Item</text></td>
              <td><text align="right" data-value="quantity">1</text></td>
              <td><text align="right" data-value="net">0.00</text></td>
            </tr>
          </table>
          <row gap="xs" data-if="invoice:totals.vatInTaxCurrency">
            <text>VAT in</text>
            <text data-value="invoice:totals.taxCurrency">EUR</text>
            <text data-value="invoice:totals.vatInTaxCurrency">0.00</text>
          </row>
          <text font-size="14pt" data-value="invoice:totals.gross">0.00</text>
          <text data-if="note" data-value="note">A note</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
```

The template has no `output` and no `attachments`: `generatePdf` makes the file PDF/A-3b and attaches the XML as `factur-x.xml`, or `xrechnung.xml` for XRECHNUNG, from the profile the XML names. A template that sets `pdfa="3a"` or `"3u"` keeps it, for a tagged invoice or one whose text can be copied out. A template that declares the invoice file itself, or sets another level, is an error.

Rendered with no invoice, as the VS Code preview renders it, the template shows its own text for each `invoice:` path, so you can design it as any template. A render with data that has no invoice shows that text too.

### The map

A map says where each value sits in the XML. Lpdf's default map applies when the call is given none, and has the values EN 16931 numbers but the parties' identifiers BT-29, BT-46, BT-60 and BT-71, what a line may hold several of, such as its notes, and an attached file's content, by names such as `seller.name`, `lines` and `totals.gross`: see [The default invoice map](?p=invoice-map). A team that wants other names, or only some, writes a map of its own and passes it as `invoiceMap`. A map given takes over whole: a name it doesn't have is not looked up in the default.

```xml
<cross-industry-invoice-map prefix="invoice">
  <value name="number" path="rsm:ExchangedDocument/ram:ID" required="true"/>
  <value name="issued" path="rsm:ExchangedDocument/ram:IssueDateTime/udt:DateTimeString" type="date"/>
  <group name="seller" path="rsm:SupplyChainTradeTransaction/ram:ApplicableHeaderTradeAgreement/ram:SellerTradeParty">
    <value name="name"  path="ram:Name" required="true"/>
    <value name="vatId" path="ram:SpecifiedTaxRegistration/ram:ID[@schemeID='VA']"/>
  </group>
  <list name="lines" path="rsm:SupplyChainTradeTransaction/ram:IncludedSupplyChainTradeLineItem" required="true">
    <value name="name" path="ram:SpecifiedTradeProduct/ram:Name"/>
    <value name="unit" path="ram:SpecifiedLineTradeDelivery/ram:BilledQuantity/@unitCode" type="code"/>
    <value name="net"  path="ram:SpecifiedLineTradeSettlement/ram:SpecifiedTradeSettlementLineMonetarySummation/ram:LineTotalAmount" type="amount"/>
  </list>
  <group name="totals" path="rsm:SupplyChainTradeTransaction/ram:ApplicableHeaderTradeSettlement">
    <value name="vat"   path="ram:SpecifiedTradeSettlementHeaderMonetarySummation/ram:TaxTotalAmount[@currencyID=ram:InvoiceCurrencyCode]" type="amount"/>
    <value name="gross" path="ram:SpecifiedTradeSettlementHeaderMonetarySummation/ram:GrandTotalAmount" type="amount"/>
  </group>
</cross-industry-invoice-map>
```

- `prefix` is what the template writes before a value: `invoice:seller.name`. A team that writes its names in German sets `prefix="rechnung"`.
- A `<value>` is one value, a `<group>` an object of the entries in it, and a `<list>` an array with an object for each element its path finds. A list holds values only.
- `required="true"` stops the call with an error that names the entry when the invoice lacks it. On a list, it asks for one item.
- `type` is `date`, `amount` or `code`: the value's normal form, and the `format` function that writes it (*Formatting values*).

A path is the elements from the place of the entry around it, in the spelling of XPath, with the prefixes `rsm:`, `ram:`, `udt:` and `qdt:` whatever the invoice calls them. It may end with an attribute, `@unitCode`, and test one element in `[ ]` on an attribute or on the text of a child element, against fixed text, `[@schemeID='VA']`, `[ram:TypeCode='VAT']`, or against the text of another element of the group, `[@currencyID=ram:InvoiceCurrencyCode]`, read from the group's own element. That last form tells the VAT total in the invoice's currency from the one in the tax currency, which are both `TaxTotalAmount`. A path finds a value and never computes one, and anything else is an error.

Lpdf never guesses which of several to take. Each path is checked against FeRD's schema of the EXTENDED profile, which every profile is a subset of, before the invoice is read: a name the schema doesn't have at that place is an error that lists what it has there, and so is a `<value>` whose path may find several and that no `[ ]` narrows.

### Formatting values

A value arrives as the invoice has it: an amount as `1250.10`, a code as `H87`. A date arrives as `2026-10-31`, or `2026-10` and `2026-W44` for a month and a week. `format` gives a function for each type, which takes the value and the full name of its entry, without the prefix or an item number (`seller.country`, `lines.unit`), and returns the text to show: anything but text is an error that names the entry. Lpdf carries no words for codes: the lists change twice a year, and each language needs its own.

::: sdk js

```javascript
const codeNames = { 'typeCode': { 380: 'Invoice', 381: 'Credit note' }, 'lines.unit': { H87: 'pcs', KGM: 'kg' } }
const format = {
    date:   (value) => new Date(value).toLocaleDateString('de-DE', { dateStyle: 'long', timeZone: 'UTC' }),
    amount: (value) => Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2 }),
    code:   (value, entryName) => codeNames[entryName]?.[value] ?? value,
}

const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), template, { invoiceXml, format, createdOn })
```
:::

::: sdk python

```python
from datetime import date
from lpdf import InvoiceFormat

code_names = {'typeCode': {'380': 'Invoice', '381': 'Credit note'}, 'lines.unit': {'H87': 'pcs', 'KGM': 'kg'}}
format = InvoiceFormat(
    date=lambda value, _: date.fromisoformat(value).strftime('%d.%m.%Y'),
    amount=lambda value, _: f'{float(value):,.2f}',
    code=lambda value, entry_name: code_names.get(entry_name, {}).get(value, value),
)

pdf = LCrossIndustryInvoice.generate_pdf(L.engine(), template, invoice_xml=invoice_xml, format=format, created_on=created_on)
```
:::

::: sdk java

```java
import io.lpdf.InvoiceFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

var format = new InvoiceFormat()
    .date((value, entryName) -> LocalDate.parse(value).format(DateTimeFormatter.ofPattern("dd.MM.yyyy")))
    .code((value, entryName) -> entryName.equals("lines.unit") && value.equals("H87") ? "pcs" : value);

byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, template,
    new GeneratePdfOptions().invoiceXml(invoiceXml).format(format).createdOn(createdOn));
```
:::

::: sdk dotnet

```csharp
using System.Globalization;

var format = new InvoiceFormat
{
    Date = (value, _) => DateTime.Parse(value, CultureInfo.InvariantCulture).ToString("d", CultureInfo.GetCultureInfo("de-DE")),
    Amount = (value, _) => decimal.Parse(value, CultureInfo.InvariantCulture).ToString("N2", CultureInfo.GetCultureInfo("de-DE")),
    Code = (value, entryName) => (entryName, value) is ("lines.unit", "H87") ? "Stück" : value,
};

var pdf = LCrossIndustryInvoice.GeneratePdf(engine, template, new() { InvoiceXml = invoiceXml, Format = format, CreatedOn = createdOn });
```
:::

::: sdk php

```php
use Lpdf\Engine\InvoiceFormat;

$format = new InvoiceFormat(
    date: fn (string $value) => (new DateTimeImmutable($value))->format('d.m.Y'),
    amount: fn (string $value) => number_format((float) $value, 2, ',', '.'),
    code: fn (string $value, string $entryName) => $entryName === 'lines.unit' && $value === 'H87' ? 'Stück' : $value,
);

$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), $template, new GeneratePdfOptions(
    invoiceXml: $invoiceXml, createdOn: $createdOn, format: $format,
));
```
:::

### The values in code

`extractInvoiceData` gives the values as plain data, the same the template binds: a value is a field, a group an object, a list an array, all text. A value the invoice lacks is absent, and a list with no items is empty. Use it to build the document in code, to pick a template by the buyer's country or the invoice's type, or to name the output file. It takes the same `invoiceMap` and `format`, and needs no engine, so it reads under the default limits: 5 seconds and 1,024 MB. In PHP, where an engine runs through FFI or the `wasmtime` program, `ExtractInvoiceDataOptions(engineOptions: …)` and `defaultInvoiceMap($engineOptions)` take the `EngineOptions` of a host whose runner is not where the default looks, with its limits. In JavaScript it runs on the calling thread, where a call can't be stopped, so the limit of 2,000,000 XML nodes bounds it instead of a timeout.

::: sdk js

```javascript
const invoiceData = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, { format })

const doc = L.document({ font: 'body', assets: { fonts: [{ name: 'body', src: 'fonts/SourceSans3-Regular.otf' }] } }, [
    L.section(NoAttr, [
        L.layout({ margin: '48pt' }, [
            L.text({ fontSize: '20pt' }, [invoiceData.seller.name]),
            ...invoiceData.lines.map((line) => L.text(NoAttr, [`${line.name}: ${line.net}`])),
            ...(invoiceData.totals.vatInTaxCurrency ? [L.text(NoAttr, [`VAT in ${invoiceData.totals.taxCurrency}: ${invoiceData.totals.vatInTaxCurrency}`])] : []),
            L.text({ fontSize: '14pt' }, [`Total ${invoiceData.totals.gross} ${invoiceData.totals.currency}`]),
        ]),
    ]),
])

const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), doc, { invoiceXml, createdOn: new Date().toISOString() })
```
:::

::: sdk python

```python
invoice_data = LCrossIndustryInvoice.extract_invoice_data(invoice_xml, format=format)
print(invoice_data['seller']['name'], invoice_data['totals']['gross'])
```
:::

::: sdk java

```java
import io.lpdf.ExtractInvoiceDataOptions;

Map<String, Object> invoiceData = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, new ExtractInvoiceDataOptions().format(format));
var seller = (Map<String, Object>) invoiceData.get("seller");
```
:::

::: sdk dotnet

```csharp
var invoiceData = LCrossIndustryInvoice.ExtractInvoiceData(invoiceXml, new() { Format = format });
var sellerName = invoiceData["seller"]!["name"]!.GetValue<string>();
```
:::

::: sdk php

```php
use Lpdf\Engine\ExtractInvoiceDataOptions;

$invoiceData = LCrossIndustryInvoice::extractInvoiceData($invoiceXml, new ExtractInvoiceDataOptions(format: $format));
echo $invoiceData['seller']['name'];
```
:::

A document built in code has no bindings, so `generatePdf` takes only the invoice's XML and the date with it. It makes the file PDF/A-3 and attaches the XML as it does for a template.

### The default map

`defaultInvoiceMap()` gives Lpdf's default map as XML text, the start of a map of your own: copy it, rename what you like, and delete what your templates don't use. It is also a [download](/schema/cross-industry-invoice-map.xml). [The default invoice map](?p=invoice-map) lists its names.

### What it checks

Lpdf checks what reading the invoice needs, and not the invoice's content: its sums, its codes and its business rules are for a validator. Each of these stops the call with an error that says what is wrong:

- **The map**: XML that is not a map, an entry or attribute it doesn't have, two entries with one name, a group or a list inside a list, a path outside the form above or with a prefix other than `rsm:`, `ram:`, `udt:` and `qdt:`, a name the EXTENDED schema doesn't have at that place, a `<value>` whose path may find several, a test on a child element that may repeat, and a `type` of `date` on what is not a date.
- **The template**: a path under the map's prefix whose name the map lacks, such as `invoice:sellr.name`, and a prefix the map doesn't name. With a plain key, such a typo would print nothing.
- **The invoice**: XML that is not UTF-8 or not well-formed, a DTD, more than 2,000,000 nodes, a root other than `rsm:CrossIndustryInvoice`, a profile Lpdf doesn't know, a value the map marks `required` that it lacks, a value that finds several, and a date that is not one.
- **MINIMUM and BASIC WL** are refused. Their XML is only a booking aid: the PDF is the legal invoice, and the lines it shows are not in the XML, so it can't be made from it. For those, fill the pages yourself and attach the XML (see [Attach the XML yourself](#attach-the-xml-yourself)).
- **The file**: a PDF/A level other than 3a, 3b or 3u, `encrypt` or `pdfx` in the document, and a document that declares `factur-x.xml` or `xrechnung.xml` itself. What any PDF/A file refuses applies too, such as text in a built-in font: see [PDF/A](?p=pdfa#errors). When the document sets no level, that error starts with `generatePdf makes the invoice a PDF/A-3b file:`.

## Attach the XML yourself

Your software writes the XML, as it writes the pages, and Lpdf attaches it and makes the PDF the spec asks for: a PDF/A-3 document with the XML as an attachment named `factur-x.xml`.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
  </assets>
  <document font="body">
    <meta title="Invoice 2026-0412" author="Northwind Paper SAS"/>
    <output pdfa="3b"/>
    <attachments>
      <file name="factur-x.xml" src="data/invoice-2026-0412.xml"/>
    </attachments>
    <section>
      <layout margin="48pt">
        <text font-size="24pt">Invoice 2026-0412</text>
        <text>Northwind Paper SAS to Atelier Lakeside SARL: 69.60 EUR, due 30 November 2026.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

When you have the invoice's XML already, [LCrossIndustryInvoice](#from-the-invoice-xml) fills the pages from it and does the rest in one call. The render needs `createdOn`, as every [PDF/A](?p=pdfa) render does. An invoice is a PDF/A-3 file, so it goes with [PDF/UA](?p=pdfua) and fast web view, and not with PDF/X or encryption: see [What combines with what](?p=combinations).

### The file name is the switch

In a document whose `output` has `pdfa="3a"`, `pdfa="3b"` or `pdfa="3u"`, an attachment named `factur-x.xml`, or `xrechnung.xml` for the XRECHNUNG profile, is the invoice. No other attribute turns it on. The file is an [attachment](?p=attachments) like any other: its bytes come from its `src` or from `loadFile`, under its `ref` or name.

Lpdf then reads which profile the invoice is from its XML, BT-24, the `ram:ID` of `rsm:ExchangedDocumentContext` / `ram:GuidelineSpecifiedDocumentContextParameter`. Spaces around the value, and namespace prefixes other than `rsm` and `ram`, are read as the spec's own files write them.

| BT-24 | Profile |
|-------|---------|
| `urn:factur-x.eu:1p0:minimum` | MINIMUM |
| `urn:factur-x.eu:1p0:basicwl` | BASIC WL |
| `urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic` | BASIC |
| `urn:cen.eu:en16931:2017` | EN 16931 |
| `urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:extended` | EXTENDED |
| a value that ends in `xrechnung_<version>`, such as `urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0` | XRECHNUNG |

Since the profile comes from the XML, the PDF and the XML can't name two different ones.

Choose BASIC or a fuller profile for an invoice. The spec notes that MINIMUM and BASIC WL hold too little to be an invoice under German fiscal law, and that France stops taking them as compliant invoices once its B2B e-invoicing reform is fully in place, in 2028. They suit a PDF whose own pages are the invoice, with the XML as a booking aid.

### What the file gets

- PDF/A-3a, PDF/A-3b or PDF/A-3u, with everything a [PDF/A](?p=pdfa) file gets: embedded fonts, the sRGB output intent, the dates and the XMP metadata.
- In the XMP metadata, the Factur-X extension schema and its four properties: `fx:DocumentType` `INVOICE`, `fx:DocumentFileName` the name of the invoice file, `fx:Version` `1.0`, and `fx:ConformanceLevel` the profile. For XRECHNUNG, `fx:Version` is the XRechnung version BT-24 ends with, such as `3.0`, as the spec's own samples write it.
- The invoice file listed in the document's associated files, as PDF/A-3 asks, dated as the document is.

When the document leaves them out, the invoice file gets the `mime` and the `relationship` the spec asks for. What the document writes is written as given.

| Profile | `mime` | `relationship` left out | The spec allows in France | In Germany |
|---------|--------|-------------------------|---------------------------|------------|
| MINIMUM, BASIC WL | `text/xml` | `data` | `data` | `data` |
| BASIC, EN 16931, EXTENDED | `text/xml` | `alternative` | `alternative`, `source` or `data` | `alternative` |
| XRECHNUNG | `text/xml` | `alternative` | — | `alternative` |

`data` says the pages hold more than the XML, which MINIMUM and BASIC WL do, since they leave out the lines. `alternative` says the two hold the same invoice. Write `relationship="source"` when your pages were made from the XML, as France allows.

### The invoice's content is yours to check

Lpdf attaches the XML as you give it. It reads BT-24 and nothing else: it doesn't check the invoice against EN 16931, whose rules and code lists change twice a year. Check the XML before you render, with the XSD and Schematron files of the Factur-X package that FNFE-MPE and FeRD publish, or with the Mustang CLI, which checks a whole Factur-X PDF, the PDF/A, the metadata and the XML:

```sh
java -jar Mustang-CLI.jar --action validate --source invoice.pdf
```

Lpdf's own tests check an invoice of each profile with the Mustang CLI on every change.

### Other attachments

The invoice can carry more files: a delivery note, a timesheet, the same invoice in another syntax. Lpdf carries each as the document declares it. The spec lists PDF, TXT, GIF, TIFF, JPG, CSV, XML, JSON, XLS, XLSX and ODS for them, though its own XRECHNUNG sample attaches PNG files, beyond that list. Lpdf refuses no format unless `facturx-strict` asks it to. The spec's names for the invoice in UBL and in EDIFACT, `factur-xubl.xml` and `factur-xedifact.edi` (a text file), are ordinary attachments.

### facturx-strict

`facturx-strict` on `output`, off by default, has Lpdf refuse what the spec doesn't allow of the attachments, instead of writing what the document gives.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `facturx-strict` | boolean | `false` | Refuses, each with an error that says what to change: an invoice file whose `mime` is not `text/xml`, an invoice file whose `relationship` the table above doesn't allow in France or Germany, and another file with no `mime` or with one that is not of a format the spec lists. It does nothing in a document without `factur-x.xml` or `xrechnung.xml` |

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
  </assets>
  <document font="body">
    <output pdfa="3b" facturx-strict="true"/>
    <attachments>
      <file name="factur-x.xml" src="data/invoice-2026-0412.xml"/>
      <file name="timesheet.csv" src="data/timesheet.csv" mime="text/csv" relationship="supplement"/>
    </attachments>
    <section>
      <layout margin="48pt">
        <text font-size="24pt">Invoice 2026-0412</text>
      </layout>
    </section>
  </document>
</lpdf>
```

A document built in code sets it in its `output`: `facturxStrict` in JavaScript, Java and PHP, `facturx_strict` in Python and `FacturXStrict` in C#.

### The XML in code

The invoice's XML is loaded as any attachment is, and the render gives its date.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

const pdf = await L.engine()
    .loadFile('factur-x.xml', readFileSync('data/invoice-2026-0412.xml'))
    .render(xml, { createdOn: new Date().toISOString() })

writeFileSync('invoice-2026-0412.pdf', pdf)
```
:::

::: sdk python

```python
from datetime import datetime, timezone
from pathlib import Path
from lpdf import L, RenderOptions

pdf = (L.engine()
    .load_file('factur-x.xml', Path('data/invoice-2026-0412.xml').read_bytes())
    .render(xml, RenderOptions(created_on=datetime.now(timezone.utc).isoformat())))

Path('invoice-2026-0412.pdf').write_bytes(pdf)
```
:::

::: sdk java

```java
import io.lpdf.EngineOptions;
import io.lpdf.L;
import io.lpdf.RenderOptions;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;

byte[] pdf = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))))
    .loadFile("factur-x.xml", Files.readAllBytes(Path.of("data/invoice-2026-0412.xml")))
    .render(xml, new RenderOptions().createdOn(Instant.now().toString()));

Files.write(Path.of("invoice-2026-0412.pdf"), pdf);
```

Java reads the font's `src` only through the engine's `srcFallback`: without it the font isn't embedded, which PDF/A refuses.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });
engine.LoadFile("factur-x.xml", await File.ReadAllBytesAsync("data/invoice-2026-0412.xml"));
var pdf = engine.Render(xml, new RenderOptions { CreatedOn = DateTimeOffset.Now.ToString("o") });

await File.WriteAllBytesAsync("invoice-2026-0412.pdf", pdf);
```

C# reads the font's `src` only through the engine's `SrcFallback`: without it the font isn't embedded, which PDF/A refuses.
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\RenderOptions;
use Lpdf\L;

$pdf = L::engine()
    ->loadFile('factur-x.xml', file_get_contents('data/invoice-2026-0412.xml'))
    ->render($xml, new RenderOptions(createdOn: date('c')));

file_put_contents('invoice-2026-0412.pdf', $pdf);
```
:::

### Errors

Each of these stops the render with an error that says what to change:

- `factur-x.xml` or `xrechnung.xml` in a document whose `output` has no `pdfa`, or `pdfa="2a"`, `"2b"` or `"2u"`: a Factur-X invoice is a PDF/A-3 file. Give the file another name if it is not the invoice
- XML that does not parse, or that is not UTF-8
- a BT-24 that is missing, or that names none of the profiles above
- `factur-x.xml` and `xrechnung.xml` in one document: the metadata names one invoice
- with `facturx-strict`, each of its three refusals

What any PDF/A file refuses applies too, such as text in a built-in font: see [PDF/A](?p=pdfa#errors).

The spec recommends PDF/A-3a, the level that adds the structure of a tagged PDF, for invoices people read with a screen reader: write `pdfa="3a"`, and `pdfua="1"` beside it for what PDF/UA asks too (see [Level a](?p=pdfa#level-a)).

Lpdf doesn't write the legacy ZUGFeRD 2.0 metadata, or document types other than an invoice, such as an order.
