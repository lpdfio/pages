# PDF/UA

PDF/UA (ISO 14289-1) is the PDF a screen reader can read: a tagged PDF that says what each thing on a page is, a heading, a paragraph, a table and its header cells, a list, a link, a picture and what it shows, and in which order to read them, and marks the rest, such as a header, a footer, a rule or a background, as decoration to skip. Accessibility law, such as the European Accessibility Act, now reaches the statements, invoices and tickets a system generates. Lpdf writes PDF/UA-1 when the document asks for it in its `output`, and the tags come from the document's own elements: a `table` is tagged as a table, a `list` as a list.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
  </assets>
  <document font="body">
    <meta title="Invoice 1234" lang="en-US"/>
    <output pdfua="1"/>
    <section>
      <layout margin="48pt">
        <text role="h1" font-size="24pt">Invoice 1234</text>
        <text>Thank you for your order. The items and the amounts are below.</text>
        <text role="h2" font-size="16pt">Items</text>
        <table cols="3fr 1fr">
          <thead>
            <td><text>Item</text></td>
            <td><text>Amount</text></td>
          </thead>
          <tr>
            <td><text>Consulting</text></td>
            <td><text>1,200.00</text></td>
          </tr>
        </table>
      </layout>
    </section>
  </document>
</lpdf>
```

## The attributes

| Element | Attribute | Type | Description |
|---------|-----------|------|-------------|
| [`output`](?p=xml/elements#output) | `pdfua` | `1` | Writes the PDF as PDF/UA-1, a tagged PDF. Without it nothing is tagged, and the attributes below change nothing |
| [`meta`](?p=xml/elements#meta) | `lang` | language tag | The language of the text, such as `en`, `en-US` or `de-CH`, which a screen reader reads it in. Required with `pdfua` |
| [`text`](?p=xml/elements#text) | `role` | `h1` … `h6` | Makes the text a heading. A text without it is a paragraph |
| [`img`](?p=xml/elements#img-layout), [`barcode`](?p=xml/elements#barcode) | `alt` | string | What the image shows, or what the barcode is for; `alt=""` marks it as decoration. Required with `pdfua` on every image and barcode of the layout but a header's or a footer's, which are decoration |
| [`layer`](?p=xml/elements#layer) | `alt` | string | Makes the layer one figure with that description. Without it a layer is decoration |

`pdfua` combines with [`pdfa`](?p=pdfa): `<output pdfa="2u" pdfua="1"/>` writes an accessible file for the archive.

## Headings

A heading is a `text` with a `role`, `h1` to `h6`. A screen reader lists the headings of a document and moves between them, so they say how it is built: the first is an `h1`, and going down they skip no level, from `h1` to `h2`, never from `h1` to `h3`. Going back up skips as many levels as it needs. The role changes nothing a page shows: set the size and the weight as on any text.

```xml
<text role="h1" font-size="24pt">Annual report</text>
<text role="h2" font-size="16pt">Revenue</text>
<text>Revenue grew in every quarter.</text>
```

A [Markdown](?p=doc/markdown) heading is tagged with its level.

## Images, barcodes and layers

An image says what it shows with `alt`, as in HTML, and `alt=""` marks it as decoration, which a screen reader skips. A barcode says what it is for: the data it encodes means nothing read aloud.

```xml
<img name="logo" width="80pt" alt="Acme Corp"/>
<barcode type="qr" data="https://pay.example/0042" width="72pt" alt="QR code to pay this invoice"/>
```

A [layer](?p=doc/layer) is decoration unless it says otherwise, as a header is: what a layer usually holds, a watermark, a running title, a logo's letters, is on every page, and a screen reader would read it on each. A layer that shows something, such as a map with its city names, takes an `alt` and is read as one figure with that description, at its place in the document: a layer written before the layout is read before it, one after it after it. Its `text-at` are not read on their own.

```xml
<layer alt="A map of the two regions: North above South">
  <circle x="470pt" y="690pt" r="22pt" fill="#cfe0fb"/>
  <text-at x="455pt" y="684pt">North</text-at>
</layer>
```

## What is tagged

| What the document has | What a screen reader gets |
|-----------------------|---------------------------|
| `text` | A paragraph, or a heading with `role`. A text over several lines or pages is one |
| `table` | A table: the cells of `thead` are the headers of their columns, and the cells that span say how far |
| `list` | A list with its items. A number is an item's label; a bullet or a checkbox is decoration |
| `link`, and a `span` with `href` | A link, described by its words |
| `fn` | A note at the foot of the page, with its number |
| A `toc` section | A table of contents with its entries |
| `markdown` | Headings with their level, paragraphs, lists, tables, and images with their alt text |
| `img`, `barcode`, and a `layer` with `alt` | A figure with its description |
| A `region` (a header or a footer), a `layer` without `alt`, a `divider`, a `shape`, backgrounds, borders, and an image or a barcode with `alt=""` | Decoration, which a reader skips |
| The header row of a table, repeated on the next page | Decoration: it is read once |

A table's header cells are those of its `thead`. A header in the first column of each row is not marked as one.

## The date

A PDF/UA file carries the date it was made, as a [PDF/A](?p=pdfa#the-date) file does, so the render gives it as `createdOn`: an ISO 8601 date, or date and time.

A document built in code asks for PDF/UA in its `output` and gives its language in its `meta`: `output: { pdfua: '1' }` and `meta: { lang: 'en-US' }` in Node.js, `DocumentOutput` and `DocumentMeta` in the other SDKs, where .NET names it `PdfUa`. `alt` and `role` are on the attributes of the image, barcode, layer and text.

## Errors

Lpdf writes what PDF/UA needs and repairs nothing of the document's own. Each of these stops the render with an error that says what to change:

- no `title` on `meta`: a reader shows it in place of the file name
- no `lang` on `meta`, or one that is not a language tag
- an `img` or a `barcode` of the layout without `alt`, but in a header or a footer: the error names it
- a first heading that is not an `h1`, or a heading that skips a level going down
- text in a built-in font, such as the default Helvetica, which is not embedded: declare a font in `assets` and set it with `font` on the document or the text. The error names the text
- a font declared in `assets` whose file was not loaded, and a font whose license forbids embedding it
- a character the font has no glyph for, which a reader would draw as an empty box
- the digits of a barcode, drawn in Helvetica: set `hrt="false"` and write the digits as text if they are needed
- a form field, whose text is drawn in Helvetica
- an [encrypted](?p=encryption) file whose `allow` leaves out `accessibility`: a screen reader must be allowed to read it
- a render without `createdOn`, or with one that is not a date

## Checking a file

A validator checks what a machine can: Lpdf's own tests check a document with each thing that is tagged with veraPDF, the PDF Association's reference validator, against its PDF/UA-1 profile on every change. To check a file of yours, run veraPDF on it. What only a person can judge, whether an alt text says what matters and whether the reading order makes sense, is checked by reading the file with a screen reader, such as VoiceOver on a Mac or NVDA on Windows.
