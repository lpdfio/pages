# Stamping existing PDFs

`stamp` draws PNG images over the pages of a PDF that Lpdf did not make: a signature on a contract, a company seal, an APPROVED or PAID stamp on a supplier's invoice, a QR code on a certificate, a photo on a form. It takes the bytes of the PDF and a list of stamps, and returns the PDF with the images on it. Nothing is laid out: the pages and their content stay as they are, and each image is drawn in its own box over them.

## Stamp a PDF

A stamp is a PNG, the pages it goes on, and a box. One call takes any number of stamps, and the file is read and written once.

::: sdk js

```javascript
import { readFile, writeFile } from 'node:fs/promises'
import { L } from '@lpdfio/lpdf'

const engine = L.engine().setLicenseKey(process.env.LPDF_LICENSE_KEY)

const contract = await readFile('contract.pdf')
const signature = await readFile('buyer-signature.png')
const initials = await readFile('buyer-initials.png')
const seal = await readFile('company-seal.png')

const signed = await engine.stamp(contract, [
    // on the signature line: across the middle of the box, at its foot
    { image: signature, page: 'last', x: '72pt', y: '640pt', width: '144pt', height: '36pt', justify: 'end' },
    // the same corner of pages 1 and 2
    { image: initials, page: '1-2', anchor: 'bottom-right', x: '-36pt', y: '-36pt', width: '60pt', height: '24pt' },
    // a small seal may grow to 1.5 times its natural size
    { image: seal, page: 'each', anchor: 'top-right', x: '-36pt', y: '36pt', width: '72pt', height: '72pt', maxGrow: 1.5 },
])
await writeFile('contract-signed.pdf', signed)
```
:::

::: sdk python

```python
import os
from pathlib import Path
from lpdf import L, StampAttr

engine = L.engine().set_license_key(os.environ['LPDF_LICENSE_KEY'])

contract = Path('contract.pdf').read_bytes()
signature = Path('buyer-signature.png').read_bytes()
initials = Path('buyer-initials.png').read_bytes()
seal = Path('company-seal.png').read_bytes()

signed = engine.stamp(contract, [
    StampAttr(image=signature, page='last', x='72pt', y='640pt', width='144pt', height='36pt', justify='end'),
    StampAttr(image=initials, page='1-2', anchor='bottom-right', x='-36pt', y='-36pt', width='60pt', height='24pt'),
    StampAttr(image=seal, page='each', anchor='top-right', x='-36pt', y='36pt', width='72pt', height='72pt', max_grow=1.5),
])
Path('contract-signed.pdf').write_bytes(signed)
```
:::

::: sdk java

```java
import io.lpdf.L;
import io.lpdf.StampAttr;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

var engine = L.engine().setLicenseKey(System.getenv("LPDF_LICENSE_KEY"));

byte[] contract = Files.readAllBytes(Path.of("contract.pdf"));
byte[] signature = Files.readAllBytes(Path.of("buyer-signature.png"));
byte[] initials = Files.readAllBytes(Path.of("buyer-initials.png"));
byte[] seal = Files.readAllBytes(Path.of("company-seal.png"));

byte[] signed = engine.stamp(contract, List.of(
    new StampAttr().image(signature).page("last").x("72pt").y("640pt").width("144pt").height("36pt").justify("end"),
    new StampAttr().image(initials).page("1-2").anchor("bottom-right").x("-36pt").y("-36pt").width("60pt").height("24pt"),
    new StampAttr().image(seal).page("each").anchor("top-right").x("-36pt").y("36pt").width("72pt").height("72pt").maxGrow(1.5)
));
Files.write(Path.of("contract-signed.pdf"), signed);
```
:::

::: sdk dotnet

```csharp
using Lpdf;
using Lpdf.Engine;

var engine = L.Engine().SetLicenseKey(Environment.GetEnvironmentVariable("LPDF_LICENSE_KEY")!);

byte[] contract = await File.ReadAllBytesAsync("contract.pdf");
byte[] signature = await File.ReadAllBytesAsync("buyer-signature.png");
byte[] initials = await File.ReadAllBytesAsync("buyer-initials.png");
byte[] seal = await File.ReadAllBytesAsync("company-seal.png");

byte[] signed = engine.Stamp(contract, [
    new StampAttr { Image = signature, Page = "last", X = "72pt", Y = "640pt", Width = "144pt", Height = "36pt", Justify = "end" },
    new StampAttr { Image = initials, Page = "1-2", Anchor = "bottom-right", X = "-36pt", Y = "-36pt", Width = "60pt", Height = "24pt" },
    new StampAttr { Image = seal, Page = "each", Anchor = "top-right", X = "-36pt", Y = "36pt", Width = "72pt", Height = "72pt", MaxGrow = 1.5 },
]);
await File.WriteAllBytesAsync("contract-signed.pdf", signed);
```
:::

::: sdk php

```php
<?php
require_once 'vendor/autoload.php';

use Lpdf\Engine\StampAttr;
use Lpdf\L;

$engine = L::engine()->setLicenseKey(getenv('LPDF_LICENSE_KEY'));

$contract = file_get_contents('contract.pdf');
$signature = file_get_contents('buyer-signature.png');
$initials = file_get_contents('buyer-initials.png');
$seal = file_get_contents('company-seal.png');

$signed = $engine->stamp($contract, [
    new StampAttr(image: $signature, page: 'last', x: '72pt', y: '640pt', width: '144pt', height: '36pt', justify: 'end'),
    new StampAttr(image: $initials, page: '1-2', anchor: 'bottom-right', x: '-36pt', y: '-36pt', width: '60pt', height: '24pt'),
    new StampAttr(image: $seal, page: 'each', anchor: 'top-right', x: '-36pt', y: '36pt', width: '72pt', height: '72pt', maxGrow: 1.5),
]);
file_put_contents('contract-signed.pdf', $signed);
```
:::

`stamp` blocks as `render` does: in JavaScript it returns a promise and runs on the render worker, with the engine's `timeout` and `maxMemoryMb`; in Python, Java, C# and PHP it returns the bytes on the calling thread.

## Options of a stamp

The names are written in each language's case: `maxGrow` in JavaScript, Java and PHP, `max_grow` in Python, `MaxGrow` in C#.

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `image` | bytes | required | The PNG. The same bytes given to several stamps are embedded in the PDF once |
| `page` | page scope | required | The pages it goes on: `3`, `1-2`, `last`, `each`, `odd`, `even`, `1,3,5-last`, as a [layer's](?p=doc/layer) `page`. A page the PDF doesn't have is an error |
| `x`, `y` | length | required without `anchor` | The box's top-left corner, from the page's top-left corner, or with `anchor`, signed offsets from that point of the page. In `pt`, `mm` or `in` |
| `anchor` | `top-left` `top-center` `top-right` `center-left` `center` `center-right` `bottom-left` `bottom-center` `bottom-right` | — | The point of the page the box is placed from, and the point of the box that goes there |
| `width`, `height` | length | required | The size of the box |
| `align` | `start` `center` `end` | `center` | Where the image sits across the box, in the room it leaves |
| `justify` | `start` `center` `end` | `center` | Where the image sits down the box, in the room it leaves |
| `scale` | `fit` `fill` | `fit` | How the image is sized in the box |
| `maxGrow` | number from 1 | `1` | How many times its natural size `fit` may grow an image |

The box is placed as a [layer element](?p=doc/layer) is, on the page as a viewer shows it: its crop box, turned the way the PDF turns it. On a page the PDF rotates, the box turns with the page, so the image stands upright to the reader. A page shown in landscape has its `x` across the landscape width.

## How the image is sized

The image keeps its proportions: it is never distorted and never cut. It fills the box one way and leaves room the other, and `align` and `justify` place it in that room. `justify="end"` sets a signature on the line at the foot of its box.

- **Natural size.** The size the PNG records, from its resolution: a scan saved at 300 dpi, 600 pixels wide, is 2 inches. A PNG that records none counts a pixel as a point, 72 to the inch. A browser canvas, and so a signature pad, records none.
- **`fit`.** An image larger than the box shrinks to fit it. A smaller one keeps its natural size, so it does not blur. `maxGrow` lets it grow up to that many times its natural size, never past the box.
- **`fill`.** The image takes the largest size that fits the box, growing or shrinking. A small image then blurs.

Sharpness comes from the pixels you send. A signature pad exported at 2× or 3× gives enough; upscaling a small PNG before sending it blurs it as `fill` does.

A PNG with transparency keeps it, so a seal or a signature shows the page through. Every color type and bit depth of PNG is read, black-and-white scans at 1 bit included; an interlaced PNG is an error. Other image formats are not taken: convert a JPEG to PNG first.

## What stays as it was

The output is the input, byte for byte, with an incremental update after it, which adds the images and the pages they change. Nothing before it is rewritten:

- **An owner password** stays, with its permissions: the stamp writes its update under the file's own encryption. A PDF that needs a password to open is an error, since the stamp can't read it.
- **A digital signature** made before the stamp stays valid for the revision it signed, and Acrobat lists the stamp among the changes made after signing. A certified document whose certification allows no changes shows that certification as broken. A digital signature applied after the stamp covers it.
- **PDF/A.** A PDF/A file of part 1, 2 or 3 stays PDF/A: the images are drawn in sRGB, at 8 bits, and a page with transparency gets the color space PDF/A asks for. PDF/A-1 allows no transparency, so a PNG with transparency on a PDF/A-1 file is an error: give it a PNG without an alpha channel, flattened onto white.
- **Tagged PDFs.** Each image is drawn as an artifact, which a screen reader skips, so a [PDF/UA](?p=pdfua) file stays PDF/UA.

## A stamp covers, it does not remove

A stamp draws over the page; what is under it is still in the file. Text under a black image can still be selected, copied and found by search, so a stamp is not a redaction.

A stamp is not a digital signature either. A drawn signature or a seal shows a mark; it does not sign the bytes of the file, and a viewer can't tell from it whether the file changed since. Whether a drawn mark is a valid signature in law depends on the jurisdiction and on the process around it, such as who signed, when and with what consent, which your application records.

## Without a license key

Like a render, a stamp works without a license key. Each page it draws on gets the Lpdf attribution line, the mark and the name, once, however many stamps the page has. It goes in the page's top-right corner, where a render puts its line, and is drawn over the stamps and the page's content. Pages without a stamp get none.

It links to lpdf.io, except on a tagged PDF. A free Community key removes it.

## Errors

What the engine refuses is the error each SDK throws for a render, with a message that says what to change and which stamp it is about:

- the input is not a PDF, or a PDF that needs a password to open
- a page the PDF doesn't have
- an image that is not a PNG, or an interlaced PNG
- a box with no `x` and `y` and no `anchor`, a stamp with no `page`, a `width` or `height` of 0
- a PNG with transparency on a PDF/A-1 file
