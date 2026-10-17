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

All the text is in the layout. A text-at in a layer is one line unless it has a width and
max-lines, which wrap it. A layer can also be turned with transform, as the contract's watermark
is; nothing is rotated here.
```

## Fonts and images

The document names 2 files, which go in an `assets` folder next to it. In Visual Studio Code, **Lpdf: New Document** puts them there.

- [assets/fonts/Montserrat-Regular.ttf](/docs/examples/brochure/assets/fonts/Montserrat-Regular.ttf)
- [assets/fonts/Radley-Regular.ttf](/docs/examples/brochure/assets/fonts/Radley-Regular.ttf)

## The document

The document is 351 lines, so it is not repeated here. Download it above to read it beside the PDF it makes.
