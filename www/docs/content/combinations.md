# What combines with what

A document sets the standards it asks for in its [`output`](?p=xml/elements#output) element, and some of them go together on one file while others do not: a PDF/A file keeps to the sRGB profile and a PDF/X file to the press profile, so a file cannot be both. A render that asks for a pair that does not go together stops with an error that says what to change. Lpdf repairs nothing in a document by itself.

## Two settings on one file

The settings are [PDF/A](?p=pdfa), [PDF/UA](?p=pdfua), [PDF/X](?p=pdfx), [encryption](?p=encryption), [fast web view](?p=fast-web-view) and [attachments](?p=attachments). Each pair, once:

| Settings | On one file |
|----------|-------------|
| PDF/A and PDF/UA | Yes |
| PDF/A and PDF/X | Refused |
| PDF/A and encryption | Refused |
| PDF/A and fast web view | Yes |
| PDF/A and attachments | PDF/A-3: yes. PDF/A-2: refused |
| PDF/UA and PDF/X | Yes |
| PDF/UA and encryption | Yes, when `allow` names `accessibility` |
| PDF/UA and fast web view | Yes |
| PDF/UA and attachments | Yes |
| PDF/X and encryption | Refused |
| PDF/X and fast web view | Yes |
| PDF/X and attachments | Refused |
| Encryption and fast web view | Yes: encrypted first, linearized last |
| Encryption and attachments | Yes: the files are encrypted too |
| Fast web view and attachments | Yes |

Yes means the two settings go on one `output`, as in `<output pdfa="2u" pdfua="1"/>`. A [Factur-X invoice](?p=factur-x-zugferd) is a PDF/A-3 file, so it combines as PDF/A-3 does: with PDF/UA and fast web view, and with neither PDF/X nor encryption.

Each refusal stops the render with an error that names both settings and says which to remove:

- **PDF/A with PDF/X:** `pdfx="4" and pdfa="2b" don't go together`. A PDF/A file keeps to the sRGB profile and a PDF/X file to the press profile.
- **PDF/A with encryption:** `pdfa="2b" and encrypt don't go together`. PDF/A forbids encryption, so that an archive can always open the file.
- **PDF/X with encryption:** `pdfx="4" and encrypt don't go together`. PDF/X forbids encryption, so that the printer can open the file.
- **PDF/UA with encryption that leaves out `accessibility`:** `an encrypted PDF/UA file lets a screen reader read its text, and allow leaves out accessibility`. Add `accessibility` to `allow`.
- **Attachments with PDF/A-2:** `the file 'name' can't be in a PDF/A-2 file`. A PDF/A-2 file carries only files that are PDF/A themselves, which the engine can't check. Write `pdfa="3a"`, `"3b"` or `"3u"`, which carries files of any kind.
- **Attachments with PDF/X:** `the file 'name' can't be in a PDF/X file`. A PDF/X file holds only what the press prints.

## What a file holds, by kind of file

A standard limits what a document may contain. This table says what each kind of file holds:

| Content | Plain PDF | PDF/A | PDF/UA | PDF/X |
|---------|-----------|-------|--------|-------|
| Text in an embedded font | Yes | Yes | Yes | Yes |
| Text in a built-in font | Yes | Refused | Refused | Refused |
| Form fields | Yes | Yes, in an embedded font, but no push button | Refused | Refused |
| A barcode's printed digits (`hrt`) | Yes | Refused | Refused | Refused |
| RGB colors: hex, `rgb()`, `hsl()` | Yes | Yes | Yes | Yes, tied to sRGB |
| CMYK colors, and spot colors with a `cmyk()` value | Yes | Refused | Yes | With a CMYK press profile: yes. With a gray or an RGB one: refused |
| Spot colors with an RGB value | Yes | Yes | Yes | Yes |
| Opacity, shadows and gradients | Yes | Yes | Yes | Yes |
| Images of every format, SVG included | Yes | Yes | Yes, each with an `alt` | Yes |
| Links | Clickable | Clickable | Clickable, and tagged | Printed, not clickable, with PDF/UA too: a screen reader reads the link's text as text |
| Bookmarks | Yes | Yes | Yes | Yes |
| Print and screen content (`ocg`) | The viewer switches it | Everything shows | Everything shows, with PDF/X too | The print version: screen content is off |
| Bulk records (`bulk`) | Yes | Levels b and u: yes. Level a: refused | Refused | Yes |

A file of two standards keeps to both columns: what either refuses is refused. Where PDF/UA and PDF/X differ, in the links and in print and screen content, the table says which one a file of both follows.

Each refusal stops the render with an error that says what to change:

- **Text in a built-in font:** `the text "…" is in Helvetica, a font built into PDF readers, which is not embedded`. Declare a font in `assets` and set it with `font` on the document or on the text.
- **A form field in PDF/X or PDF/UA:** `the form field 'name' can't be in a PDF/X file`, and the same for PDF/UA. In PDF/X the reason is that a field is something to click and type in on the printed page. In PDF/UA it is that a field is not a Form element of the file's structure, which Lpdf doesn't write yet. Remove the field, or remove the standard.
- **A form field in PDF/A:** a field is set in the font around it, so one in a built-in font gives `the form field 'name' is in Helvetica, a font built into PDF readers, which is not embedded`. Declare a font in `assets` and set it with `font` on the document or on a box around the field. A push button gives `the push button 'name' can't be in a PDF/A file yet`: remove it, or remove `pdfa`.
- **A barcode's printed digits:** `a barcode's digits (hrt) are drawn in Helvetica, which is not embedded`. Set `hrt="false"` on the barcode, and write the digits as text in a font of `assets` if they are needed.
- **CMYK in PDF/A:** `the color cmyk(…) is CMYK, and the sRGB output intent of a PDF/A file covers RGB colors only`. A spot color whose `value` is `cmyk()` gets the same error. Give the color as a hex one, or give the spot color an RGB `value`.
- **CMYK in PDF/X with a gray or an RGB press profile:** `the profile 'name' prints in an RGB color space, not CMYK`, or in a gray one. Use a CMYK profile of the press, or give the color as RGB.
- **An image, a barcode or a chart without `alt` in PDF/UA:** `the image 'name' has no alt, and a PDF/UA file says what each image shows`, and `a chart has no alt` for a chart. Add `alt` with a description, or `alt=""` when it is decoration. A barcode, an image or a chart in a header or a footer needs none.
- **Bulk records in PDF/UA and in PDF/A at level a:** `a bulk table is not tagged for a reader`. Render the document without `bulk`, or take a PDF/A of level b or u.

[Color and print](?p=color-and-print) has the colors of each kind of file in one place, and [Standards and print](?p=standards) says which standard fits which job.
