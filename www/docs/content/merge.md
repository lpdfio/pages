# Merging PDFs for print

`merge` takes PDFs that Lpdf did not make and returns one PDF made for printing: several contracts from different sources, sent to the printer as one file. It takes the files as bytes, each with its name, and returns the merged file. Nothing is laid out. Each page is drawn as it looked, at its own size, and what is not on the printed page is left behind: forms, links and bookmarks are gone, and the file keeps the look of the pages.

It is not a way to edit or read PDFs. The merged file is for the printer, not for the screen, where the originals are the better copy.

## Merge PDFs

Give `merge` the files in the order they are to print. Each is a name, which every error about it uses, and the file's bytes.

::: sdk js

```javascript
import { readFile, writeFile } from 'node:fs/promises'
import { L } from '@lpdfio/lpdf'

const engine = L.engine().setLicenseKey(process.env.LPDF_LICENSE_KEY)

const merged = await engine.merge([
    { name: 'contract-a.pdf', pdf: await readFile('contract-a.pdf') },
    { name: 'contract-b.pdf', pdf: await readFile('contract-b.pdf') },
    { name: 'contract-c.pdf', pdf: await readFile('contract-c.pdf') },
], { doubleSided: true })
await writeFile('contracts-to-print.pdf', merged)
```
:::

::: sdk python

```python
import os
from pathlib import Path
from lpdf import L, MergeOptions, MergeSource

engine = L.engine().set_license_key(os.environ['LPDF_LICENSE_KEY'])

merged = engine.merge(
    [MergeSource(name=name, pdf=Path(name).read_bytes())
     for name in ('contract-a.pdf', 'contract-b.pdf', 'contract-c.pdf')],
    MergeOptions(double_sided=True),
)
Path('contracts-to-print.pdf').write_bytes(merged)
```
:::

::: sdk java

```java
import io.lpdf.L;
import io.lpdf.MergeOptions;
import io.lpdf.MergeSource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

var engine = L.engine().setLicenseKey(System.getenv("LPDF_LICENSE_KEY"));

byte[] merged = engine.merge(
    List.of(
        new MergeSource().name("contract-a.pdf").pdf(Files.readAllBytes(Path.of("contract-a.pdf"))),
        new MergeSource().name("contract-b.pdf").pdf(Files.readAllBytes(Path.of("contract-b.pdf"))),
        new MergeSource().name("contract-c.pdf").pdf(Files.readAllBytes(Path.of("contract-c.pdf")))),
    new MergeOptions().doubleSided(true));
Files.write(Path.of("contracts-to-print.pdf"), merged);
```
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var engine = L.Engine().SetLicenseKey(Environment.GetEnvironmentVariable("LPDF_LICENSE_KEY")!);

byte[] merged = engine.Merge(
    [
        new MergeSource { Name = "contract-a.pdf", Pdf = await File.ReadAllBytesAsync("contract-a.pdf") },
        new MergeSource { Name = "contract-b.pdf", Pdf = await File.ReadAllBytesAsync("contract-b.pdf") },
        new MergeSource { Name = "contract-c.pdf", Pdf = await File.ReadAllBytesAsync("contract-c.pdf") },
    ],
    new MergeOptions { DoubleSided = true });
await File.WriteAllBytesAsync("contracts-to-print.pdf", merged);
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\MergeOptions;
use Lpdf\Engine\MergeSource;
use Lpdf\L;

$engine = L::engine()->setLicenseKey(getenv('LPDF_LICENSE_KEY'));

$merged = $engine->merge(
    [
        new MergeSource(name: 'contract-a.pdf', pdf: file_get_contents('contract-a.pdf')),
        new MergeSource(name: 'contract-b.pdf', pdf: file_get_contents('contract-b.pdf')),
        new MergeSource(name: 'contract-c.pdf', pdf: file_get_contents('contract-c.pdf')),
    ],
    new MergeOptions(doubleSided: true),
);
file_put_contents('contracts-to-print.pdf', $merged);
```
:::

`merge` blocks as `render` does: in JavaScript it returns a promise and runs on the render worker, with the engine's `timeout` and `maxMemoryMb`; in Python, Java, C# and PHP it returns the bytes on the calling thread. One call takes 1,000 files at most.

## Options of a merge

The names are written in each language's case: `allowSigned` in JavaScript and PHP, `allow_signed` in Python, `AllowSigned` in C#, and `allowSigned(…)` in Java. The options argument is optional, and each option is off by default.

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `allowSigned` | `true` `false` | `false` | Merge a file that is signed. Its signature is lost, since a signature covers the bytes of its own file, and its visible appearance still prints. Without it, a signed file is an error |
| `allowRestricted` | `true` `false` | `false` | Merge a file whose owner password restricts printing or copying. Without it, such a file is an error |
| `doubleSided` | `true` `false` | `false` | Add a blank side after a document with an odd number of pages, so that each document starts on a front side when the result is printed on both sides of the sheet |

A file is described by two fields: `name`, the file's name as you want it in errors (`contract-b.pdf`), and `pdf`, its bytes.

## What the merged file holds

Each page of each file is drawn on a page of the merged file, in the order of the files and of their pages. A page is drawn as a viewer shows it.

- **Size.** The page has the size it shows at: its crop box, turned by the turn the file gives it. A file with pages of mixed sizes prints with mixed sizes, and the paper is left to whoever prints.
- **Content.** The page looks as it did: text, images, vectors and transparency are drawn from the file's own content, with its fonts. Nothing is converted or rendered to pixels.
- **Annotations.** An annotation that prints is drawn from its stored appearance, over the page's content. It prints when its Print flag is set and its Hidden flag is not. A check box or a radio button draws the state it is in. Links and pop-ups draw nothing. The merged file holds no annotation, so a link does not work in it.
- **Form fields.** A field is drawn from the appearance the file stores for it, filled or empty, and the form itself is gone: the merged file has no fields to fill. A field that has a value but no stored appearance would print blank, so it is an error (below).
- **Layers.** A file's layers, its optional content groups, are carried over. Each is on or off in the merged file as it prints in its file, so every viewer shows and prints what the original printed. A layer that does not print in its file does not show in the merged file either.
- **Version.** The merged file's PDF version is the highest among the files'.

What is not on the printed page is left behind: bookmarks, links and named destinations, form fields and their scripts, the document's title, author and other properties, embedded files, and the structure of a tagged PDF. The merged file claims no PDF/A, PDF/UA or PDF/X and is not tagged, encrypted or linearized.

## Printing on both sides of the sheet

Printed on both sides of the sheet, a document with an odd number of pages ends on a front side, and the next document would start on the back of it. With `doubleSided`, one blank page the size of that document's last page follows each document with an odd number of pages, so the next starts on a front side. None follows the last document. The blank page is empty, without the line a merge without a license key draws.

## Files that are refused

A merge never returns a silently wrong file. Each of these is an error, a message that names the file and says what to change, in the error each SDK throws for a render:

| A file that | Error | To merge it |
|-------------|-------|-------------|
| Needs a password to open | `contract-b.pdf: the PDF needs a password to open, and a merge can't open it: remove the password first` | Remove the open password first |
| Has an owner password that restricts printing or copying | `contract-b.pdf: the owner restricts printing or copying: set the allow-restricted option to merge it anyway` | Set `allowRestricted` |
| Is signed | `contract-b.pdf: the file is signed, and a merge can't keep a signature, …` | Set `allowSigned`, which drops the signature |
| Has a form field with a value and no stored appearance | `contract-b.pdf: page 2: the form field 'name' has a value but no stored appearance, so it would print blank: …` | Open the file in a PDF viewer and save it, which stores the appearance |
| Can't be read, or isn't a PDF | `notes.txt: the file is not a PDF: it doesn't start with %PDF-` | Give the PDF |

A file that opens without a password but has an owner password is read as any other: the owner password only restricts what the file allows. An empty signature field is not a signature, and does not need `allowSigned`.

A merge with no files, or with more than 1,000, is an error too, and so is a merge that runs past the engine's `timeout` or needs more than its `maxMemoryMb`.

## Without a license key

Like a render, a merge works without a license key. Each merged page gets the Lpdf attribution line, the mark and the name, once, in the page's top-right corner where a render puts its line, drawn over the page's content. The line has no link, since the merged file holds no annotation, and the blank sides `doubleSided` adds stay empty. A free Community key removes it.

## Which PDFs it reads

`merge` reads PDFs that make a page the way a viewer does. It is checked on files from these tools, in these PDF versions: Microsoft Word 2013, Adobe Acrobat Distiller 23, Adobe LiveCycle Designer ES 9.0 and Designer 6.5, Antenna House PDF Output Library 6.6, iText 7, Skia/PDF (Chrome's print to PDF), macOS Quartz and Lpdf, in PDF 1.3, 1.4, 1.6 and 1.7, with and without compressed object streams, with pages turned by `/Rotate`, cut by a crop box, of mixed sizes and inheriting their resources. Each result passes `qpdf --check`, and each page of it renders like the page it comes from.

A file that Lpdf's reader can't read is an error that names the file.
