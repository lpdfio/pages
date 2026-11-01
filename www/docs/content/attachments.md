# Attachments

A PDF can carry files inside it: the XML of an invoice for the software that books it, the spreadsheet a report was made from, or the terms that go with an offer. A reader lists them in its attachments panel, and saves or opens them from there. Lpdf embeds the files a document lists in its `attachments`, as they are: it does not draw them.

```xml
<lpdf version="1">
  <document>
    <attachments>
      <file name="invoice.xml" src="data/invoice-2026-0412.xml" mime="text/xml" relationship="data"
            description="The invoice as data, for software to read"/>
      <file name="terms.pdf" src="terms.pdf" mime="application/pdf" relationship="supplement"/>
    </attachments>
    <section>
      <layout margin="48pt">
        <text font-size="24pt">Invoice 2026-0412</text>
        <text>The invoice data and the terms of sale are attached to this PDF.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## The attachments element

`attachments` sits in `document`, after `meta` and `output` and before the sections. It holds one `file` for each file the PDF carries.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | The name a reader shows the file under and saves it as, such as `invoice.xml`. Each file of a document has a name of its own |
| `src` | path | — | Where the SDK reads the file from, when it was not loaded on the engine |
| `ref` | string | the name | The key the file was loaded on the engine under, when that is not its name |
| `mime` | string | `application/octet-stream` | The type of the file, such as `text/xml`, `application/pdf` or `text/csv`: a type and a subtype. Without it a reader knows only that it is a file |
| `relationship` | `source` `data` `alternative` `supplement` `unspecified` | `unspecified` | How the file relates to the document: the file it was made from, the data its pages show (an e-invoice's XML is `data`), the same content in another form, or more than the pages show |
| `description` | string | — | A line about the file, which a reader shows beside its name |

The files belong to the whole document. A file pinned to a spot on a page, or tied to one image or table, is not written.

## The bytes

The bytes of a file come as an image's do. The SDK reads `src`, relative to the working directory of your app, or you load the bytes on the engine yourself, under the file's name or its `ref`. A file loaded on the engine is used for every render of that engine, and its `src`, if it has one, is not read.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

const pdf = await L.engine()
    .loadFile('invoice.xml', readFileSync('data/invoice-2026-0412.xml'))
    .render(xml)

writeFileSync('invoice.pdf', pdf)
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\L;

$pdf = L::engine()
    ->loadFile('invoice.xml', file_get_contents('data/invoice-2026-0412.xml'))
    ->render($xml);

file_put_contents('invoice.pdf', $pdf);
```
:::

::: sdk python

```python
from pathlib import Path
from lpdf import L

pdf = (L.engine()
    .load_file('invoice.xml', Path('data/invoice-2026-0412.xml').read_bytes())
    .render(xml))

Path('invoice.pdf').write_bytes(pdf)
```
:::

::: sdk dotnet

```csharp
using Lpdf;

using var engine = L.Engine();
engine.LoadFile("invoice.xml", await File.ReadAllBytesAsync("data/invoice-2026-0412.xml"));
var pdf = engine.Render(xml);

await File.WriteAllBytesAsync("invoice.pdf", pdf);
```

.NET reads a `src` only through the engine's `SrcFallback`, as it does an image's: `L.Engine(new() { SrcFallback = File.ReadAllBytes })`. Without one, a file with a `src` that was not loaded is an error that says so.
:::

A document built in code lists its files in `attachments`, a list of `FileAttr` with the attributes of `file`: `attachments: [{ name: 'invoice.xml', mime: 'text/xml', relationship: FileRelationship.Data }]` in Node.js, `Attachments` in .NET. `FileRelationship` holds the five relationships.

## Size and memory

A file has no size limit of Lpdf's own, beyond the 2 GB a PDF can say a file holds. In the .NET, PHP and Python SDKs the engine is a WASI binary, and the bytes travel to it as base64 in a JSON request, so a large file costs several times its size in memory while it renders: the request, the bytes the engine decodes, the PDF that holds them and the PDF sent back. Node.js hands the bytes to the engine directly.

## Encryption and PDF/A

In an [encrypted](?p=encryption) document the files are encrypted with the rest, under the same passwords.

A [PDF/A-2](?p=pdfa) file can carry only files that are PDF/A themselves, which the engine can't check, so `attachments` with `pdfa` is an error. PDF/A-3, which carries any file, as an e-invoice does, is not written yet.

## Errors

Each of these stops the render with an error that says what to change:

- a file with no bytes: no `src`, and nothing loaded under its name or `ref`. The error names the key to load it under
- a `src` the SDK can't read. The error names the file and the path
- two files with the same name
- a `relationship` that isn't one of the five, or a `mime` that isn't a type and a subtype
- a file without a name
- a file over 2 GB
- `attachments` in a document whose `output` asks for `pdfa`
