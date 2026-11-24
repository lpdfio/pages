# Color and print

A color in a PDF is RGB, which screens show, or CMYK, the four inks a press prints with, or an ink of its own, a spot color. Lpdf writes each as it is given and never converts between them. This page says which form is for what, how the press profile, bleed and print-only content fit a job for a printer, and which colors each kind of file takes.

## RGB, CMYK and spot colors

| Written as | In the PDF | For |
|------------|------------|-----|
| `#1763cf`, `rgb(23, 99, 207)`, `hsl(215, 80%, 45%)` | RGB | Screens. `rgb()` and `hsl()` give the same PDF as their hex |
| `cmyk(91, 61, 0, 19)` | CMYK, the four inks | Print. A printer separates the plates without converting from RGB, which shifts colors |
| `brand`, or `brand 30%` | An ink of its own, in a Separation color space named after the ink | A brand color, a varnish or a die line, printed from a plate of its own |

A named color from `tokens` goes wherever a color does. The forms and their ranges are in [XML Schema, colors](?p=xml/schema#colors).

- **Both in one document.** RGB and CMYK colors can share a document and a page: `#1763cf` for the screen and `cmyk(91, 61, 0, 19)` for print.
- **No alpha.** A color is always solid, and `rgba()` is an error. Set `opacity` on a [layer](?p=doc/layer#opacity), on a [box](?p=doc/layout#opacity) or on a shadow.
- **Keep print colors opaque.** Content that is faded is blended in RGB, its `cmyk()` colors included. They are still written as inks, but they are converted to blend, and so at print too.
- **Gradients.** A gradient's colors are all CMYK, all RGB, or all tints of one spot color. It fills a `background` or a `fill`, and as a text color, a stroke or a border it is an error. See [XML Schema, gradients](?p=xml/schema#gradients).

## Spot colors

A spot color is an ink printed from a plate of its own. Declare each in `spots` inside `tokens`, with the ink's name as the printer knows it and a color that stands in for it on a screen or a proof, and use its name wherever a color goes, solid or as a tint from `0%` to `100%`: `brand 30%`.

- **Tints.** Only a spot color takes a tint. For any other color, write the lighter color itself.
- **Overprint.** `overprint="true"` prints the ink on top of the inks under it. A varnish needs it, or the picture under it is not printed, and so does a die line. A screen doesn't show overprint: Acrobat's Overprint Preview and a press do.
- **No ink library.** Lpdf ships none: a spot color's ink name and its stand-in color are the document's.

The attributes, and a document with a brand color, a varnish and a die line, are in [XML Schema, spot colors](?p=xml/schema#spot-colors).

## The press profile

A printer gives out the ICC profile of the press and paper a job runs on, such as a FOGRA39 or FOGRA51 profile in Europe or a GRACoL or SWOP one in the US. A [PDF/X](?p=pdfx#the-press-profile) file names it in `profile`, and it is the file's output intent. Lpdf bundles no profile, and a display profile such as sRGB is an error.

With the press profile, a PDF/X-4 file keeps each color in the space it was given in:

- CMYK colors stay CMYK, as the printer separates them.
- Spot colors stay inks of their own, each printed from its own plate, with their tints and overprint.
- RGB colors and RGB images, whatever their format, are tied to the sRGB profile the engine carries, so the printer's tools convert them to the press the same way every time.
- Opacity, shadows and gradients are kept.

The profile is gray, RGB or CMYK. With a gray or an RGB profile, a CMYK color, a CMYK gradient and a spot color whose `value` is `cmyk()` are errors.

## Bleed

A background or an image that should run to the edge of the cut page has to reach past it, since the cut is never exact. `bleed` on the document or on a section sets how far each page reaches past its trim edge on every side, and most printers ask for 3mm. Each page gets a `TrimBox` and a `BleedBox`, the page `background` fills the bleed, and a layer reaches into it with coordinates below zero or past the page's size. `bleed` works without `pdfx`. See [PDF/X, bleed](?p=pdfx#bleed).

## Print and screen content

Content for one of the two goes in a group of its own. `ocg="print"` on an element prints it and does not show it on screen, and `ocg="screen"` shows it on screen and does not print it. In a PDF/X file the print content is on and the screen content is in the file, off. See [Print and screen content](?p=print-and-screen).

## A print job

A flyer for a press: a brand ink that bleeds past the trim, a tint of the same ink, a varnish that overprints, and black text in CMYK. The document asks for PDF/X-4 with the printer's profile and a 3mm bleed.

```xml
<lpdf version="1">
  <assets>
    <font name="body" src="fonts/Radley-Regular.ttf"/>
    <profile name="press" src="profiles/FOGRA39L_coated.icc"/>
  </assets>
  <tokens>
    <spots>
      <spot name="brand" ink="PANTONE 1665 C" value="cmyk(0, 85, 100, 0)"/>
      <spot name="varnish" ink="Varnish" value="cmyk(0, 0, 0, 10)" overprint="true"/>
    </spots>
  </tokens>
  <document size="A5" font="body" bleed="3mm">
    <meta title="Spring flyer"/>
    <output pdfx="4" profile="press"/>
    <section>
      <layer>
        <rect x="-9pt" y="-9pt" width="438pt" height="150pt" fill="brand"/>
        <rect x="40pt" y="200pt" width="340pt" height="80pt" fill="brand 25%"/>
        <rect x="40pt" y="200pt" width="340pt" height="80pt" fill="varnish"/>
        <text-at x="56pt" y="232pt" font-size="14pt" color="cmyk(0, 0, 0, 100)">A 25% tint of the brand ink, under a varnish</text-at>
      </layer>
      <layout margin="40pt">
        <text font-size="32pt" color="#ffffff">Spring sale</text>
        <text color="#ffffff">The band is a spot color. It reaches past the trim edge.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## Colors in each kind of file

| Color | Plain PDF | PDF/A | PDF/UA | PDF/X |
|-------|-----------|-------|--------|-------|
| RGB: hex, `rgb()`, `hsl()` | Yes | Yes | Yes | Yes, tied to sRGB |
| CMYK, and spot colors with a `cmyk()` value | Yes | Refused | Yes | With a CMYK press profile: yes. With a gray or an RGB one: refused |
| Spot colors with an RGB value | Yes | Yes | Yes | Yes |
| Opacity, shadows and gradients | Yes | Yes | Yes | Yes |

A PDF/A file has the sRGB output intent, which covers RGB colors only. [What combines with what](?p=combinations) has the rest of what each kind of file holds.

## Errors

A color is read strictly, so that a typo stops the render and does not print the wrong color. Each of these is an error that says what to change:

| Refused | The error says |
|---------|----------------|
| `rgba(1, 2, 3, 0.5)` | `a color has no alpha: fade a box or a layer with opacity` |
| `rgb(9%, 39%, 81%)` | `rgb() takes numbers from 0 to 255, not percentages` |
| `hsl(215, 0.8, 0.45)` | `saturation '0.8' needs a %, as in hsl(215, 80%, 45%)` |
| `cmyk(0, 0, 100)` | `expected 4 values, as in cmyk(0, 0, 0, 100), but found 3` |
| A color name that `tokens` don't define | `unknown color token: 'name'` |
| A gradient of CMYK and RGB colors | `its stops mix CMYK and RGB colors: a gradient is all one or the other` |
| A gradient as a text color, a stroke or a border | `is a gradient, which can fill a background or a shape but not color a text, a stroke or a border` |
| A tint of a color that is not a spot color | `only a spot color takes a tint` |
| A tint out of its range | `the tint '130%' is not a percentage from 0% to 100%` |
| A tint without its `%` | `the tint '30' needs a %, as in 30%` |
| A spot color declared twice | `the spots row has it twice: give each spot color a name of its own` |
| Two spot colors with one ink | `an ink is printed from one plate, so declare it once` |
| An ink named `All`, `None`, `Cyan`, `Magenta`, `Yellow` or `Black` | `the ink can't be named 'Black'` |
| A spot color whose `value` is a color name | `the value 'primary' is not a color as written` |

The errors of each standard, such as CMYK in PDF/A, are on [What combines with what](?p=combinations).
