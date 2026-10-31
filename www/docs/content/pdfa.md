# PDF/A

PDF/A (ISO 19005) is the PDF that archives, courts, public bodies and banks ask for: a file that carries everything it needs to look the same decades from now. Lpdf writes PDF/A-2b and PDF/A-2u when the document asks for it in its `output`, and the render gives the date the file carries.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
  </assets>
  <document font="body">
    <meta title="Annual report" author="Finance"/>
    <output pdfa="2u"/>
    <section>
      <layout margin="48pt">
        <text font-size="24pt">Annual report</text>
        <text>Kept as PDF/A: the fonts, the colors and the metadata travel with the file.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## The pdfa attribute

`pdfa` is an attribute of [`output`](?p=xml/elements#output), the element of `document` that says how the file is written.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `pdfa` | `2b` `2u` | — | Writes the PDF as PDF/A-2b, which keeps the look of every page, or PDF/A-2u, which also maps all text to Unicode so it can be searched and copied. Without it the PDF is a plain one |

Part 2 of the standard allows transparency, so opacity, shadows and gradients are kept. Level 2a, which adds the structure of tagged PDF, and part 3, which carries other files such as the XML of an e-invoice, are not written yet.

## What the file gets

- Every font embedded, cut down to the characters the document uses, with a map back to Unicode.
- An XMP packet that names the part and the level, with the title, author, subject, keywords and creator of `meta`, the producer and the dates, the same as the document's information dictionary.
- The sRGB output intent: a color profile that gives the RGB colors and images their meaning.
- The date of the render as both its creation and its modification date, and a file ID, the same for the same document.
- Links that print.

Lpdf's own tests check a PDF/A-2b and a PDF/A-2u document with veraPDF, the PDF Association's reference validator, on every change. To check a file of yours, run veraPDF on it: it reads the level the file declares and checks it against that level's rules.

## The date

A PDF/A file carries the date it was made, and the engine has no clock, so the render gives it as `createdOn`: an ISO 8601 date, or date and time, such as `2026-10-31` or `2026-10-31T09:30:00+01:00`. A fraction of a second is dropped.

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { writeFileSync } from 'node:fs'

L.engine()
    .render(xml, { createdOn: new Date().toISOString() })
    .then((pdf) => writeFileSync('report.pdf', pdf))
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\RenderOptions;
use Lpdf\L;

$pdf = L::engine()->render($xml, new RenderOptions(createdOn: date('c')));

file_put_contents('report.pdf', $pdf);
```
:::

::: sdk python

```python
from datetime import datetime, timezone
from pathlib import Path
from lpdf import L, RenderOptions

pdf = L.engine().render(xml, RenderOptions(created_on=datetime.now(timezone.utc).isoformat()))

Path('report.pdf').write_bytes(pdf)
```
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var pdf = await L.Engine().Render(xml, new RenderOptions { CreatedOn = DateTimeOffset.Now.ToString("o") });

await File.WriteAllBytesAsync("report.pdf", pdf);
```
:::

A document built in code asks for PDF/A in its `output` too: `output: { pdfa: '2u' }` in Node.js, `DocumentOutput` in the other SDKs, where .NET names it `PdfA`.

## Errors

Lpdf writes what PDF/A needs and repairs nothing of the document's own. Each of these stops the render with an error that says what to change:

- text in a built-in font, such as the default Helvetica, which is not embedded: declare a font in `assets` and set it with `font` on the document or the text. The error names the text
- a font declared in `assets` whose file was not loaded
- a font whose license forbids embedding it
- a character the font has no glyph for, which a reader would draw as an empty box
- a CMYK color or gradient: the sRGB output intent covers RGB colors only
- a form field, whose text is drawn in Helvetica
- the digits of a barcode, drawn in Helvetica: set `hrt="false"` and write the digits as text if they are needed
- `encrypt` on the same `output`: PDF/A forbids encryption, so that an archive can always open the file
- [`attachments`](?p=attachments): a PDF/A-2 file can carry only files that are PDF/A themselves, which the engine can't check
- a render without `createdOn`, or with one that is not a date
