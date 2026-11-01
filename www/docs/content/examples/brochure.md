# Brochure

A two-page A4 landscape brochure where the layers are the design, with embedded fonts and a QR code.

[document.xml](/docs/examples/brochure/document.xml)

<iframe class="lpdf-example-viewer"
        src="/assets/js/lpdf-demo/viewer/index.html?pdf=/docs/examples/brochure/document.pdf"
        title="The brochure, in the PDF viewer"
        loading="lazy"></iframe>

## What it shows

```text
A brochure for a private investment firm, two A4 landscape pages: a cover and an inside page. The
firm, its companies and its figures are invented, and it is a sample, not an offer of anything. This
is the example where the layers are the design and the layout sits on top of it. What this adds to
the contract:

  fonts          two files, a display serif and a text sans, embedded: <font src> in <assets>, then
                 font="display" or font="text". They are in assets/fonts, with notes on their licences
                 (SIL Open Font License). Each has one weight, so the hierarchy is size and colour
  layers         the cover is a green panel, soft circles and rising bars drawn behind the text, and
                 the text is placed over them. The layout does not know the shapes are there: the
                 coordinates and the widths are agreed by hand
  layers         one layer for each opacity: the panel is solid, the circles are at 0.14 and the bars
                 at 0.6. Opacity is set on a layer, and a shape with an opacity of its own is an error
  path           the curve over the bars: M and C, in points from the top left of the page
  sections       each section has a layout of its own, and the margin is the layout's: the cover's is
                 0pt so its panels reach the edge, and the inside page's is 36pt
  justify        justify="between" on a column spreads its parts from top to bottom of its height
  barcode        a QR code, dark on light so that it scans on the dark band
  pdfx           written for a commercial printer, as PDF/X-4: <output pdfx="4" profile="press">,
                 with the printer's profile declared in <assets> (a FOGRA39 one, in assets/profiles).
                 The render needs created_on, the date the file carries, and every text an embedded font
  bleed          bleed="3mm" on the document: each page reaches 3mm past its trim edge, the sand
                 background fills it, and the cover's panel, drawn from x=-9pt, runs off the edge
  cmyk           brass is a process color, cmyk(), as the printer separates it; the greens and the
                 sand are hex, which the file ties to sRGB, as it does the chart, an RGB image
  link           the address on the cover is a link: a PDF/X file prints its text and leaves out
                 what makes it clickable

All the text is in the layout. A text-at in a layer is one line unless it has a width and
max-lines, which wrap it. A layer can also be turned with transform, as the contract's watermark
is; nothing is rotated here.
```

## Fonts and images

The document names 4 files, which go in an `assets` folder next to it. In Visual Studio Code, **Lpdf: New Document** puts them there.

- [assets/fonts/Montserrat-Regular.ttf](/docs/examples/brochure/assets/fonts/Montserrat-Regular.ttf)
- [assets/fonts/Radley-Regular.ttf](/docs/examples/brochure/assets/fonts/Radley-Regular.ttf)
- [assets/images/committed-capital.png](/docs/examples/brochure/assets/images/committed-capital.png)
- [assets/profiles/FOGRA39L_coated.icc](/docs/examples/brochure/assets/profiles/FOGRA39L_coated.icc)

## The document

The document is 369 lines, so it is not repeated here. Download it above to read it beside the PDF it makes.
