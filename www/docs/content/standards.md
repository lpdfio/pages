# Standards and print

A PDF from Lpdf is a plain PDF until the document asks for more. The [`output`](?p=xml/elements#output) element of the document turns on each PDF standard, encryption and fast web view, and a few attributes elsewhere handle print: bleed, print-only content and the color of the inks. This page says what each is for, who asks for it and what turns it on, which one fits which job, and where every other area of Lpdf is documented.

## The standards

Each is set in the `output` element, and a document that sets none of them gives a plain PDF. A document can set several: [Combinations](?p=combinations) says which go together and which are refused.

| Standard | What it is for | Who asks for it | Turned on with | Page |
|----------|----------------|-----------------|----------------|------|
| PDF/A | A file that looks the same decades from now, with every font in it | Archives, courts, public bodies and banks | `<output pdfa="2u"/>`, or another of `2a`, `2b`, `3a`, `3b`, `3u` | [PDF/A](?p=pdfa) |
| Factur-X and ZUGFeRD | An e-invoice: a PDF/A-3 file whose pages are the invoice people read, carrying the same invoice as XML that accounting software reads | Businesses that send invoices to customers in France and Germany | A file named `factur-x.xml` or `xrechnung.xml` in the `attachments` of a PDF/A-3 document | [Factur-X e-invoices](?p=facturx) |
| PDF/UA | A tagged PDF that a screen reader can read | Anyone bound by accessibility law, such as the European Accessibility Act, for the statements, invoices and tickets a system generates | `<output pdfua="1"/>` | [PDF/UA](?p=pdfua) |
| PDF/X | A file for a commercial printer: what the press prints, tied to the printer's color profile | Printers | `<output pdfx="4" profile="press"/>` | [PDF/X](?p=pdfx) |
| Encryption | An open password, an owner password and permissions for printing, copying and editing | Anyone who sends a document that only its reader may open, such as a statement with the customer's own password | `<output encrypt="aes-256" allow="print"/>`, or `encrypt="rc4-128"` for readers that cannot open AES-256 | [Encryption](?p=encryption) |
| Fast web view | A file a browser shows page by page while it is still downloading | Large documents read in a browser, such as statements, catalogues, reports and books | `<output linearize="true"/>` | [Fast web view](?p=fast-web-view) |

## For print

A job for a printer uses these as well as PDF/X, and each also works in a plain PDF.

| What | What it does | Turned on with | Page |
|------|--------------|----------------|------|
| CMYK and spot colors | Writes a color as the press's inks, or as an ink of its own | `cmyk(0, 85, 100, 0)`, or a spot color declared in `tokens` | [Color and print](?p=color-and-print) |
| Bleed | Each page reaches past its trim edge, so a background runs to the cut | `bleed="3mm"` on the document or a section | [PDF/X, bleed](?p=pdfx#bleed) |
| Print and screen content | Content that shows only on screen, or only on paper | `ocg="print"` or `ocg="screen"` on an element | [Print and screen content](?p=print-and-screen) |

## Which standard fits which job

- **Keep a document for years.** Write PDF/A. `pdfa="2u"` keeps the look of every page and lets the text be searched and copied, `2b` keeps the look only, and `2a` also tags the file for screen readers. Part 3 (`3a`, `3b`, `3u`) is the same with attachments of any kind. The render gives the file its date as `createdOn`.
- **Send an e-invoice to a customer in France or Germany.** Write a PDF/A-3 document and attach the invoice's XML as `factur-x.xml`, or as `xrechnung.xml` for the XRechnung profile. Lpdf reads the profile from the XML, which is one of MINIMUM, BASIC WL, BASIC, EN 16931, EXTENDED and XRECHNUNG, and writes the Factur-X metadata. It checks nothing else in the XML: the invoice's content is yours to check.
- **Make a file a screen reader can read.** Write `pdfua="1"`, give `meta` a `title` and a `lang`, and give every image and barcode an `alt`. It goes with PDF/A, PDF/X and linearization, and with encryption when `allow` names `accessibility`.
- **Send a file to a printer.** Write `pdfx="4"` with the printer's press profile, and `bleed` as the printer asks: most printers ask for 3mm. CMYK colors and spot colors stay the printer's inks. A PDF/X file can't be encrypted, can't be PDF/A and carries no attachments.
- **Let only the readers who have a password open a file.** Write `encrypt="aes-256"` and give the passwords with the render call. A file can't be encrypted and PDF/A, or encrypted and PDF/X.
- **Show a large file at once in a browser.** Write `linearize="true"`. It goes with every other setting. A one-page document gains nothing from it.
- **Show some content only on screen, or only on paper.** Put `ocg="screen"` or `ocg="print"` on the element. In a PDF/A or PDF/UA file everything shows, and a PDF/X file is the print version.

A job that needs none of these is a plain PDF: leave `output` out.

## Everything else Lpdf does

The other areas, and the page that covers each:

- **Images:** which formats an image reads and which it refuses, and how an SVG is drawn: [Image, formats](?p=doc/layout/img#formats).
- **Color:** hex, `rgb()`, `hsl()`, `cmyk()`, spot colors and gradients: [Color and print](?p=color-and-print), and [XML Schema, colors](?p=xml/schema#colors).
- **Fonts and text:** the built-in fonts, TrueType, OpenType and variable fonts, and the text elements: [Installation, images and fonts](?p=install#images-and-fonts), [Text](?p=doc/layout/text) and [Markdown](?p=doc/markdown).
- **Layout:** sections, page sizes, boxes, tables, lists, headers, footers and page numbers: [Section](?p=doc/section), [Layout](?p=doc/layout), [Table](?p=doc/layout/table) and [List](?p=doc/layout/list).
- **Barcodes:** the types and what each takes as data: [Barcode](?p=doc/layout/barcode).
- **Forms:** fillable fields: [Field](?p=doc/layout/field).
- **Graphics:** layers, shapes, shadows and ruled pages: [Layer](?p=doc/layer), [Shape](?p=doc/layout/shape) and [XML Schema, rulings](?p=xml/schema#rulings).
- **Attachments:** files carried inside the PDF: [Attachments](?p=attachments).
- **Stamping existing PDFs:** images drawn over the pages of a PDF Lpdf did not make: [Stamping existing PDFs](?p=stamp).
- **Data binding:** filling a document from JSON, and records by the hundreds of thousands: [Data binding](?p=data/binding) and [Bulk records](?p=data/bulk).
- **Bookmarks, page labels and metadata:** [Bookmark](?p=doc/layout/bookmark), [Section, page numbers](?p=doc/section#page-numbers) and [All elements, meta](?p=xml/elements#meta).
- **Render limits:** time and memory: [Installation, time limit](?p=install#time-limit) and [memory limit](?p=install#memory-limit).

The complete list, with the version each feature came in and where each stops, is [FEATURES.md](https://github.com/lpdfio/lpdf/blob/main/FEATURES.md) in the Lpdf repository.
