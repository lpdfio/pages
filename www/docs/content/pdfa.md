# PDF/A

PDF/A (ISO 19005) is the PDF that archives, courts, public bodies and banks ask for: a file that carries everything it needs to look the same decades from now. Lpdf writes PDF/A-2a, PDF/A-2b, PDF/A-2u, PDF/A-3a, PDF/A-3b and PDF/A-3u when the document asks for it in its `output`, and the render gives the date the file carries.

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
| `pdfa` | `2a` `2b` `2u` `3a` `3b` `3u` | — | Writes the PDF as PDF/A-2b, which keeps the look of every page, or PDF/A-2u, which also maps all text to Unicode so it can be searched and copied, or PDF/A-2a, which also tags the file with the structure a screen reader reads, or the same levels of part 3, PDF/A-3b, PDF/A-3u and PDF/A-3a, which also carry [attachments](?p=attachments) of any kind. Without it the PDF is a plain one |

Parts 2 and 3 of the standard allow transparency, so opacity, shadows and gradients are kept. Part 3 is part 2 with files of any kind attached, such as the XML of an e-invoice: a PDF/A-3 file that carries `factur-x.xml` is a [Factur-X e-invoice](?p=facturx). A file can be PDF/A and [PDF/UA](?p=pdfua), the tagged PDF a screen reader reads, at once: `<output pdfa="2u" pdfua="1"/>`, or at [level a](#level-a), `<output pdfa="2a" pdfua="1"/>`.

## What the file gets

- Every font embedded, cut down to the characters the document uses, with a map back to Unicode.
- An XMP packet that names the part and the level, with the title, author, subject, keywords and creator of `meta`, the producer and the dates, the same as the document's information dictionary.
- The sRGB output intent: a color profile that gives the RGB colors and images their meaning.
- The date of the render as both its creation and its modification date, and a file ID, the same for the same document.
- Links that print.
- Everything the document has, on screen and in print: [print and screen content](?p=print-and-screen) (`ocg`) shows everywhere, so the archive copy holds both.
- At level a, the structure of a tagged PDF: see [Level a](#level-a).

Lpdf's own tests check a document at each of the six levels with veraPDF, the PDF Association's reference validator, on every change. To check a file of yours, run veraPDF on it: it reads the level the file declares and checks it against that level's rules.

## Level a

Level a, `2a` or `3a`, is level u with the structure of a tagged PDF: what each text, heading, table, list, link, footnote and image is, in reading order, with headers, footers and borders marked as decoration. Lpdf writes the same structure as for [PDF/UA](?p=pdfua), from the same attributes: `role` makes a text a heading, `alt` describes an image or a barcode, and `lang` on `meta` gives the language.

Level a asks for the structure and not for what PDF/UA asks of the document. Without `pdfua`, a level-a document may have no `title` and no `lang`, its headings may skip levels, and an `img` or a `barcode` without `alt` is decoration, which a screen reader skips. That file is valid PDF/A-2a, but a screen reader can't tell what its images show. For a file a screen reader can use, write `pdfua="1"` beside it: the render then refuses what PDF/UA refuses, and the file is PDF/A and PDF/UA both.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
  </assets>
  <document font="body">
    <meta title="Annual report" lang="en"/>
    <output pdfa="2a" pdfua="1"/>
    <section>
      <layout margin="48pt">
        <text role="h1" font-size="24pt">Annual report</text>
        <text>Tagged for screen readers, and kept for the archive.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

Level a gives every character of Unicode's private use area, U+E000 to U+F8FF and planes 15 and 16, words of its own, since it means only what its font draws, as an icon font's symbols do. Lpdf doesn't write those words, so such a character is an error at level a: write the character it stands for if Unicode has one, show the symbol as an `img` with `alt`, or use level u. The same text renders at levels b and u, and with `pdfua` alone.

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

::: sdk python

```python
from datetime import datetime, timezone
from pathlib import Path
from lpdf import L, RenderOptions

pdf = L.engine().render(xml, RenderOptions(created_on=datetime.now(timezone.utc).isoformat()))

Path('report.pdf').write_bytes(pdf)
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
    .render(xml, new RenderOptions().createdOn(Instant.now().toString()));

Files.write(Path.of("report.pdf"), pdf);
```

Java reads the font's `src` only through the engine's `srcFallback`: without it the font isn't embedded, which PDF/A refuses.
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var pdf = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes })
    .Render(xml, new RenderOptions { CreatedOn = DateTimeOffset.Now.ToString("o") });

await File.WriteAllBytesAsync("report.pdf", pdf);
```

C# reads the font's `src` only through the engine's `SrcFallback`: without it the font isn't embedded, which PDF/A refuses.
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

A document built in code asks for PDF/A in its `output` too: `output: { pdfa: '2u' }` in JavaScript, `DocumentOutput` in the other SDKs, where C# names it `PdfA`.

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
- `pdfx` on the same `output`: a PDF/A file keeps to the sRGB profile, and a [PDF/X](?p=pdfx) file to the press profile
- [`attachments`](?p=attachments) with `2a`, `2b` or `2u`: a PDF/A-2 file can carry only files that are PDF/A themselves, which the engine can't check. Write `3a`, `3b` or `3u` to carry files
- an attachment named `factur-x.xml` or `xrechnung.xml` with `2a`, `2b` or `2u`: it makes the file a [Factur-X invoice](?p=facturx), which is PDF/A-3
- at level a, a `lang` on `meta` that is not a language tag: give one such as `en`, `en-US` or `de-CH`
- at level a, a character of Unicode's private use area, such as an icon font's symbol: see [Level a](#level-a)
- a render without `createdOn`, or with one that is not a date
