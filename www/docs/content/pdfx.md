# PDF/X

PDF/X (ISO 15930) is the PDF that commercial printers ask for: a file that holds what the press prints and nothing else, made for the printer's own press, so the colors come out as intended. Lpdf writes PDF/X-4 when the document asks for it in its `output` and names the printer's color profile, and any page can bleed past its trim edge.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
    <profile name="press" src="profiles/FOGRA39L_coated.icc"/>
  </assets>
  <document size="a4" font="body" bleed="3mm" background="cmyk(0, 2, 6, 0)">
    <meta title="Spring brochure"/>
    <output pdfx="4" profile="press"/>
    <section>
      <layer>
        <rect x="-9pt" y="-9pt" width="614pt" height="140pt" fill="cmyk(100, 0, 0, 0)"/>
      </layer>
      <layout margin="48pt">
        <text font-size="32pt" color="#ffffff">Spring collection</text>
        <text>The cyan band and the paper tone are process colors; the rest is RGB, tied to sRGB.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## The pdfx and profile attributes

Both are attributes of [`output`](?p=xml/elements#output), the element of `document` that says how the file is written, and each needs the other.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `pdfx` | `4` | — | Writes the PDF as PDF/X-4, which keeps RGB colors, images and transparency, tied to color profiles. Without it the PDF is a plain one |
| `profile` | string | — | The [`profile`](?p=xml/elements#profile) of `assets` the file is made for: the ICC profile of the printing press |

PDF/X-1a, which allows CMYK only and no transparency, is not written. A file can be PDF/X and [PDF/UA](?p=pdfua), the tagged PDF a screen reader reads, at once: `<output pdfx="4" profile="press" pdfua="1"/>`.

## The press profile

The printer gives out the ICC profile of the press and paper a job runs on, such as a FOGRA39 or FOGRA51 profile in Europe or a GRACoL or SWOP one in the US. Ask for it, and declare it in `assets`:

```xml
<assets>
  <profile name="press" src="profiles/printer-coated.icc"/>
</assets>
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | string | **Required.** The name `profile` on `output` picks it by. Lowercase letters, digits and `-`, starting with a letter |
| `src` | path | Path of the `.icc` file, read by the SDK from the machine that renders |
| `ref` | string | The key the profile's bytes are registered under with `loadProfile`. Defaults to `name` |

It has to be a printer (output) profile, in gray, RGB or CMYK. A display profile such as sRGB is an error that says so. The engine bundles no press profile: the file carries the one the document names, as its output intent.

A profile is read from its `src`, or its bytes are loaded on the engine, as a font's are:

::: sdk js

```javascript
import { L } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

const pdf = await L.engine()
    .loadProfile('press', readFileSync('profiles/printer-coated.icc'))
    .render(xml, { createdOn: new Date().toISOString() })

writeFileSync('brochure.pdf', pdf)
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\RenderOptions;
use Lpdf\L;

$pdf = L::engine()
    ->loadProfile('press', file_get_contents('profiles/printer-coated.icc'))
    ->render($xml, new RenderOptions(createdOn: date('c')));

file_put_contents('brochure.pdf', $pdf);
```
:::

::: sdk python

```python
from datetime import datetime, timezone
from pathlib import Path
from lpdf import L, RenderOptions

pdf = (L.engine()
    .load_profile('press', Path('profiles/printer-coated.icc').read_bytes())
    .render(xml, RenderOptions(created_on=datetime.now(timezone.utc).isoformat())))

Path('brochure.pdf').write_bytes(pdf)
```
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var pdf = L.Engine()
    .LoadProfile("press", File.ReadAllBytes("profiles/printer-coated.icc"))
    .Render(xml, new RenderOptions { CreatedOn = DateTimeOffset.Now.ToString("o") });

await File.WriteAllBytesAsync("brochure.pdf", pdf);
```
:::

In .NET a `src` is read through the engine's `SrcFallback`, as a font's is. A document built in code declares the profile in its assets and asks for PDF/X in its `output`: `assets: { profiles: [{ name: 'press', src }] }` and `output: { pdfx: '4', profile: 'press' }` in Node.js, `DocumentAssets` with `ProfileAttr` and `DocumentOutput` in the other SDKs, where .NET names it `PdfX`.

## Bleed

A background or an image that should run to the edge of the cut page has to reach past it, since the cut is never exact. `bleed` on `document` sets how far each page reaches past its trim edge on every side, and a `section` overrides it; `0mm` takes it away. Most printers ask for 3mm.

- The PDF page grows by the bleed: its `TrimBox` is the page's `size`, and its `BleedBox` and `MediaBox` the grown page.
- The page `background` fills the bleed.
- The layout keeps to the trimmed page, so a document lays out the same with or without a bleed. A layer reaches into the bleed with coordinates below zero or past the page's size, as the band above does.

`bleed` works without `pdfx`: the file then gets the boxes and the grown page, and nothing else changes.

## Colors

A press prints in its own inks, and the press profile says how. A PDF/X-4 file keeps each color in the space it was given in:

- `cmyk()` colors stay CMYK, as the printer separates them.
- RGB colors, `#hex`, `rgb()` and `hsl()`, and PNG and JPEG images are tied to the sRGB profile the engine carries, so the printer's tools convert them to the press the same way every time.
- Opacity, shadows and gradients are kept: PDF/X-4 allows transparency.

## What the file gets

- A `TrimBox` and a `BleedBox` on every page.
- The press profile as its output intent.
- RGB tied to sRGB on every page.
- Every font embedded, cut down to the characters the document uses.
- The title, the version, `PDF/X-4`, and that the file is not trapped, in its information dictionary and an XMP packet, with the ids printers' tools read.
- The date of the render as both its creation and its modification date, and a file ID, the same for the same document.
- The print version of [print and screen content](?p=print-and-screen) (`ocg`): print content is on, and screen content stays in the file, off, where a reader can turn it on in a layers panel.
- No links: PDF/X allows nothing clickable on the printed page, so a `link`, a link in a span or in Markdown, a table of contents entry and the line an unlicensed render adds print their text and are not clickable. Bookmarks stay.

No free tool validates PDF/X: Acrobat Pro's Preflight does ("Verify compliance with PDF/X-4"), and so does the printer's own preflight. Lpdf's tests check every part of the file, and open it with qpdf, on every change.

## The date

A PDF/X file carries the date it was made, and the engine has no clock, so the render gives it as `createdOn`, as for [PDF/A](?p=pdfa#the-date): an ISO 8601 date, or date and time.

## Errors

Lpdf writes what PDF/X needs and repairs nothing of the document's own. Each of these stops the render with an error that says what to change:

- `pdfx` without `profile`, or `profile` without `pdfx`
- a `profile` that is not declared in `assets`, or whose bytes were not loaded
- a profile that is not an ICC printer profile, such as a display profile
- a document without a `title` on `meta`
- text in a built-in font, such as the default Helvetica, which is not embedded: declare a font in `assets` and set it with `font` on the document or the text. The error names the text
- a font declared in `assets` whose file was not loaded, a font whose license forbids embedding it, and a character the font has no glyph for
- the digits of a barcode, drawn in Helvetica: set `hrt="false"` and write the digits as text if they are needed
- a form field, which is something to click on the printed page
- a CMYK color or gradient when the press profile is a gray or RGB one
- `encrypt` on the same `output`: PDF/X forbids encryption, so that the printer can open the file
- `pdfa` on the same `output`: a PDF/A file keeps to the sRGB profile, and a PDF/X file to the press profile
- [`attachments`](?p=attachments): a PDF/X file holds only what the press prints
- a render without `createdOn`, or with one that is not a date
