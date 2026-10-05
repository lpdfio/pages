# Brochure

A two-page A4 landscape brochure where the canvas is the design, with embedded fonts and a QR code.

<iframe class="lpdf-example-viewer"
        src="/assets/js/lpdf-demo/viewer/index.html?pdf=/docs/examples/brochure/document.pdf"
        title="The brochure, in the PDF viewer"
        loading="lazy"></iframe>

## What it shows

```text
A brochure for a private investment firm, two A4 landscape pages: a cover and an inside page. The
firm, its companies and its figures are invented, and it is a sample, not an offer of anything. This
is the example where the canvas is the design and the layout sits on top of it. What this adds to
the contract:

  fonts          two files, a display serif and a text sans, embedded: <font src> in <assets>, then
                 font="display" or font="text". They are in assets/fonts, with notes on their licences
                 (SIL Open Font License). Each has one weight, so the hierarchy is size and colour
  canvas         the cover is a green panel, soft circles and rising bars drawn behind the text, and
                 the text is placed over them. The layout does not know the shapes are there: the
                 coordinates and the widths are agreed by hand
  layers         one layer for each opacity: the panel is solid, the circles are at 0.14 and the bars
                 at 0.6. A shape's own opacity is ignored, and a layer's is not
  path           the curve over the bars: M and C, in points from the top left of the page
  sections       a section can change the page settings: the cover has no margin so its panels reach
                 the edge, and the inside page has 36pt
  justify        justify="between" on a stack spreads its parts from top to bottom of its height
  barcode        a QR code, dark on light so that it scans on the dark band

All the text is in the layout. Text on the canvas is one line only. A layer can also be turned with
transform, as the contract's watermark is; nothing is rotated here.
```

## Fonts and images

The document names 2 files, which go in an `assets` folder next to it. In Visual Studio Code, **Lpdf: New Document** puts them there.

- [assets/fonts/Montserrat-Regular.ttf](/docs/examples/brochure/assets/fonts/Montserrat-Regular.ttf)
- [assets/fonts/Radley-Regular.ttf](/docs/examples/brochure/assets/fonts/Radley-Regular.ttf)

## The document

The document is 354 lines, so it is not repeated here. Open it in the demo to read it beside the PDF it makes, or download it above.
