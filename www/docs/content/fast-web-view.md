# Fast web view

A browser opens a PDF from a server a piece at a time: it asks for the bytes it needs, by range, and shows a page as soon as it has them. That works when the file is linearized (ISO 32000-1, Annex F): page 1 and everything it draws come first, with hints that say where every other page is. In any other PDF the table that says where things are is at the end, so a viewer reads the end of the file before it can show a page. Lpdf writes a linearized file, which readers call fast web view, when the document asks for it in its `output`.

```xml
<document>
  <meta title="Spring catalogue"/>
  <output linearize="true"/>
  <section>
    <layout margin="48pt">
      <text font-size="24pt">Spring catalogue</text>
      <text>Page 1 shows while the rest of the file is still on its way.</text>
    </layout>
  </section>
</document>
```

## The linearize attribute

It is an attribute of [`output`](?p=xml/elements#output), the element of `document` that says how the file is written.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `linearize` | boolean | `false` | Writes the PDF linearized, for fast web view. It changes nothing a viewer shows |

It combines with every other attribute of `output`: a file can be [encrypted](?p=encryption), [PDF/A](?p=pdfa), [PDF/UA](?p=pdfua) or [PDF/X](?p=pdfx), and linearized too.

## What changes in the file

- Page 1 comes first, with every font, image and object it draws, after a short dictionary that says the file is linearized and how long it is. A viewer that has those bytes shows page 1.
- A hint stream says where each other page starts, how long it is, and which objects it shares with other pages, so a viewer can fetch any page on its own.
- The other pages follow in page order, each with the objects only it draws, then the objects later pages share, then the rest of the document, such as its bookmarks.
- Each page names only the fonts and images it draws. A file that isn't linearized names all of them on every page, which costs nothing there, but would put every image of the document before page 1.

Linearizing doesn't shrink a file or change what it shows. It pays off for large documents read in a browser, such as statements, catalogues, reports and books. A one-page invoice gains nothing from it.

## With encryption

With `encrypt` as well, the file is encrypted first and linearized last, so the hints point at the encrypted objects. The passwords come with the render call, as for any [encrypted](?p=encryption) document.

```xml
<document>
  <output encrypt="aes-256" allow="print" linearize="true"/>
  <section>
    <layout margin="48pt">
      <text>Statement for October</text>
    </layout>
  </section>
</document>
```

## Serving the file

A viewer fetches a PDF by range only when the server answers range requests. A static file server, object storage such as Amazon S3, and a CDN do. To check a server, ask it for the first kilobyte of the file:

```sh
curl -sI -H "Range: bytes=0-1023" https://example.com/catalogue.pdf
```

The answer to look for is `206 Partial Content`. With `200 OK` the server sends the whole file every time, and a viewer shows page 1 only once it has all of it, as for any PDF.

## After the render

Any change to the file after the render ends its linearization: a stamp, a signature, or pages merged in by another tool. The file still opens, but a viewer loads it whole before it shows a page. Make the change in the document and render it again, or linearize the changed file again with a tool such as `qpdf --linearize`.
