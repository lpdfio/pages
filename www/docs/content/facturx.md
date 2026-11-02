# Factur-X e-invoices

Factur-X, called ZUGFeRD in Germany, is a hybrid e-invoice: a PDF/A-3 file whose pages are the invoice people read, carrying the same invoice as EN 16931 XML, which accounting software reads. France and Germany accept it as an electronic invoice. Factur-X and ZUGFeRD are one joint format, and Lpdf writes it as its spec, Factur-X 1.09.2 and ZUGFeRD 2.5.2, describes it: a PDF/A-3 document that carries an attachment named `factur-x.xml` is a Factur-X invoice.

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

Your software writes the XML, as it writes the pages, and Lpdf attaches it and makes the PDF the spec asks for. The render needs `createdOn`, as every [PDF/A](?p=pdfa) render does.

## The file name is the switch

In a document whose `output` has `pdfa="3b"` or `pdfa="3u"`, an attachment named `factur-x.xml`, or `xrechnung.xml` for the XRECHNUNG profile, is the invoice. No other attribute turns it on. The file is an [attachment](?p=attachments) like any other: its bytes come from its `src` or from `loadFile`, under its `ref` or name.

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

## What the file gets

- PDF/A-3b or PDF/A-3u, with everything a [PDF/A](?p=pdfa) file gets: embedded fonts, the sRGB output intent, the dates and the XMP metadata.
- In the XMP metadata, the Factur-X extension schema and its four properties: `fx:DocumentType` `INVOICE`, `fx:DocumentFileName` the name of the invoice file, `fx:Version` `1.0`, and `fx:ConformanceLevel` the profile. For XRECHNUNG, `fx:Version` is the XRechnung version BT-24 ends with, such as `3.0`, as the spec's own samples write it.
- The invoice file listed in the document's associated files, as PDF/A-3 asks, dated as the document is.

When the document leaves them out, the invoice file gets the `mime` and the `relationship` the spec asks for. What the document writes is written as given.

| Profile | `mime` | `relationship` left out | The spec allows in France | In Germany |
|---------|--------|-------------------------|---------------------------|------------|
| MINIMUM, BASIC WL | `text/xml` | `data` | `data` | `data` |
| BASIC, EN 16931, EXTENDED | `text/xml` | `alternative` | `alternative`, `source` or `data` | `alternative` |
| XRECHNUNG | `text/xml` | `alternative` | — | `alternative` |

`data` says the pages hold more than the XML, which MINIMUM and BASIC WL do, since they leave out the lines. `alternative` says the two hold the same invoice. Write `relationship="source"` when your pages were made from the XML, as France allows.

## The invoice's content is yours to check

Lpdf attaches the XML as you give it. It reads BT-24 and nothing else: it doesn't check the invoice against EN 16931, whose rules and code lists change twice a year. Check the XML before you render, with the XSD and Schematron files of the Factur-X package that FNFE-MPE and FeRD publish, or with the Mustang CLI, which checks a whole Factur-X PDF, the PDF/A, the metadata and the XML:

```sh
java -jar Mustang-CLI.jar --action validate --source invoice.pdf
```

Lpdf's own tests check an invoice of each profile with the Mustang CLI on every change.

## Other attachments

The invoice can carry more files: a delivery note, a timesheet, the same invoice in another syntax. Lpdf carries each as the document declares it. The spec lists PDF, TXT, GIF, TIFF, JPG, CSV, XML, JSON, XLS, XLSX and ODS for them, though its own XRECHNUNG sample attaches PNG files, beyond that list. Lpdf refuses no format unless `facturx-strict` asks it to. The spec's names for the invoice in UBL and in EDIFACT, `factur-xubl.xml` and `factur-xedifact.edi` (a text file), are ordinary attachments.

## facturx-strict

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

A document built in code sets it in its `output`: `facturxStrict` in Node.js and PHP, `FacturXStrict` in .NET and `facturx_strict` in Python.

## In code

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

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

using var engine = L.Engine();
engine.LoadFile("factur-x.xml", await File.ReadAllBytesAsync("data/invoice-2026-0412.xml"));
var pdf = engine.Render(xml, new RenderOptions { CreatedOn = DateTimeOffset.Now.ToString("o") });

await File.WriteAllBytesAsync("invoice-2026-0412.pdf", pdf);
```
:::

## Errors

Each of these stops the render with an error that says what to change:

- `factur-x.xml` or `xrechnung.xml` in a document whose `output` has no `pdfa`, or `pdfa="2b"` or `"2u"`: a Factur-X invoice is a PDF/A-3 file. Give the file another name if it is not the invoice
- XML that does not parse, or that is not UTF-8
- a BT-24 that is missing, or that names none of the profiles above
- `factur-x.xml` and `xrechnung.xml` in one document: the metadata names one invoice
- with `facturx-strict`, each of its three refusals

What any PDF/A file refuses applies too, such as text in a built-in font: see [PDF/A](?p=pdfa#errors).

Lpdf doesn't write PDF/A-3a, the level that adds the structure of a tagged PDF, the legacy ZUGFeRD 2.0 metadata, or document types other than an invoice, such as an order.
