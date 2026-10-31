# XML Schema

lpdf documents are described in XML. Download the schema: [lpdf.xsd](https://lpdf.io/schema/1/lpdf.xsd) (`version="1"`, what this page documents).

## Document structure

```
<lpdf version="1">
  <assets>           ← optional: fonts, images
  <tokens>           ← optional: custom scales, aliases, colors and gradients
  <document>         ← required
    <meta>           ← optional: title, author, subject, keywords, creator
    <output>         ← optional: encryption, what a reader may do, PDF/A
    <attachments>    ← optional: the files the PDF carries
    <section>+       ← one or more, each with its own pages
      <bookmark>     ← optional: marks the section's first page
      <layer>*       ← fixed content, painted under the layout
        …shapes, text-at, img-at, barcode-at
      <layout>       ← optional: flow content, at most one
        …elements
      <markdown>     ← or Markdown in the place of the layout
      <layer>*       ← fixed content, painted over the layout
```

A document holds sections, and a section holds any number of layers and at most one `layout` or one [`markdown`](?p=doc/markdown), painted in the order they are written. The schema also allows `layout` directly inside `document` for a single section, but the engine does not accept that form yet: it stops with "unexpected element in document". Always put it in a `section`.

```xml
<document size="letter">
  <section>
    <layout margin="48pt">
      <text>Hello world</text>
    </layout>
  </section>
</document>
```

## Attribute types

Each attribute has the type the schema gives it, and the engine checks every attribute against it before it lays anything out. The reference tables name the types.

- **A boolean** is `true` or `false`, nothing else: `bold="yes"` and `bold="1"` are errors.
- **A whole number**, such as `cols` or `start`, and **a number**, such as `opacity` or a gradient's `angle`, are written in digits, with a point for a fraction: `opacity="0.5"`. Each has the range the schema gives it: `cols` goes from 1 to 12, `opacity` from 0 to 1.
- **`line-height`** is a name from the line-height row of the [tokens](#tokens), such as `m`, or a factor above 0, such as `1.5`.
- Everything else is text, lengths with their unit included: `font-size="12pt"`.

A value that is not of its type is an error that names the element, the attribute and the type, such as `<grid> at line 12, col 9: cols must be a whole number from 1 to 12, not "x"`. So is an attribute the element doesn't have, which lists the ones it has: `<gradient> at line 4, col 7: unknown attribute 'agle' — expected name, type, from, to, angle`. The `data-*` attributes of [data binding](?p=data/binding) and the namespaced ones that point an editor at the schema, such as `xsi:noNamespaceSchemaLocation`, are left out of the check.

In code, the attribute objects of each SDK take the same types: `bold: true`, `cols: 3`, `opacity: 0.5`, and `lineHeight: 1.5` or `'m'`. TypeScript and C# refuse a value of another type when they compile, PHP when the object is made, and the engine when it renders for Python and plain JavaScript, with the same error as for the XML.

## Page sizes

Set on `document`, and overridden per `section`, with `size`. Without one, a document is A4.

| Value    | Dimensions        |
|----------|-------------------|
| `letter` | 8.5 × 11 in       |
| `legal`  | 8.5 × 14 in       |
| `a3`     | 297 × 420 mm      |
| `a4`     | 210 × 297 mm      |
| `a5`     | 148 × 210 mm      |

Custom: `size="200pt 300pt"`, the width then the height, both in `pt`. `orientation="landscape"` swaps the two.

## Units

Lengths are in points (`pt`, 1/72 in). Where other units work depends on the attribute:

| Where | Accepts |
|-------|---------|
| Layout lengths: `gap`, `padding`, `margin`, `width`, `height`, `font-size`, `radius`, `thickness`, `toc-indent-step` | `pt` or a [token](#tokens) name |
| Layer positions and sizes: `x` `y` `width` `height` `r` `rx` `ry` `x1`…`y2`, and a layer's `radius` and `stroke-width` | `pt`, `mm` or `in` |
| Table `cols` | `fr`, `pt` or `%` |

Layout lengths do not take `mm`, `in`, `px` or `%`: the engine stops with an "invalid space value" or "invalid width value" error. A layer's `x`, `y` and the line ends are signed, so they accept negative numbers: `-18pt`.

## Tokens

A token is a name for a length. Each attribute reads its own scale, so `m` is 8pt as a `gap` and 11pt as a `font-size`. The exception is `line-height`, whose tokens are factors of the font size, not lengths.

| Token | space: `gap` `padding` `margin` `toc-indent-step` | text size: `font-size` | border: `border` `thickness` | `radius` | `width` | `height` | grid: `col-width` | line height: `line-height` |
|-------|------|------|------|------|------|------|------|-----|
| `xs`  | 2pt  | 7pt  | 0.5pt | 2pt  | 120pt | 16pt | 60pt  | 1.0 |
| `s`   | 4pt  | 9pt  | 1pt   | 4pt  | 200pt | 24pt | 100pt | 1.1 |
| `m`   | 8pt  | 11pt | 1.5pt | 6pt  | 280pt | 32pt | 140pt | 1.2 |
| `l`   | 14pt | 14pt | 2pt   | 10pt | 360pt | 48pt | 180pt | 1.4 |
| `xl`  | 20pt | 20pt | 3pt   | 16pt | 440pt | 64pt | 220pt | 1.6 |
| `xxl` | 32pt | 28pt | 4pt   | 24pt | 515pt | 96pt | 280pt | 2.0 |

`width` is a scale of page-wide measures, with no use for the height of a card or a row, so `height` has a row of its own: `height="m"` works on a box, a table, an `img`, a `shape` and a barcode. Before v0.29.0 a barcode or a form field read a token `height` from the `width` row.

`padding` and `margin` take one to four values, written like CSS, and each can be a token: `padding="m 24pt"` is 8pt top and bottom and 24pt left and right.

To change a scale, or to name colors or gradients, add `tokens` before `document`. A scale row needs all six values:

```xml
<lpdf version="1">
  <tokens>
    <space xs="2pt" s="6pt" m="12pt" l="18pt" xl="24pt" xxl="36pt"/>
    <colors>
      <color name="brand" value="#d76f04"/>
      <color name="text" value="#222222"/>
    </colors>
  </tokens>
  <document size="letter">
    <section>
      <layout margin="48pt">
        <column gap="m" padding="l" background="brand">
          <text>Uses the new scale and the named color</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
```

The scale elements are `space`, `text-size`, `border`, `radius`, `width`, `height`, `grid` and `line-height`. A `line-height` row takes factors, not `pt` values: `<line-height xs="1.0" s="1.1" m="1.2" l="1.4" xl="1.6" xxl="2.0"/>`, and in code the factors are numbers: `lineHeight: { xs: 1, s: 1.1, m: 1.2, l: 1.4, xl: 1.6, xxl: 2 }`. A color named `text` becomes the default text color.

## Aliases

An alias is a name of your own for a slot of the scale. Define it in `aliases` inside `tokens`, and use it wherever an attribute takes a slot (`xs` to `xxl`):

```xml
<lpdf version="1">
  <tokens>
    <aliases>
      <alias name="caption" value="xs"/>
      <alias name="body" value="m"/>
    </aliases>
  </tokens>
  <document size="letter">
    <section>
      <layout margin="48pt">
        <column gap="body">
          <text font-size="caption">Set in the text size xs</text>
          <text font-size="body">Set in the text size m</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
```

An alias names a slot, not a row, so every row shares it: `caption` is the text size `xs` as a `font-size`, the space `xs` as a `gap` and the height `xs` as a `height`. When a document changes a row, the alias follows it. The one-to-four values of `padding` and `margin`, and the thickness of a `border`, take aliases too: `padding="tight roomy"`, `border="hairline #cccccc"`.

A name is lowercase letters, digits and `-`, and starts with a letter. It cannot be `xs`, `s`, `m`, `l`, `xl`, `xxl`, `fill` or `full`, which mean something already. Its `value` is a slot, not another alias, and a name defined twice is an error.

**The engine catches a mistyped name, not the schema.** An attribute that takes a slot accepts any name, so checking a document against the schema no longer flags `gap="medum"`. The engine stops on it and says what it expects: `invalid space value: 'medum': expected a slot from xs to xxl, an alias (body, caption) or a pt value`.

## Colors

A color is written in one of four forms, or as the name of a color in `tokens`:

```
"#1763cf"               ← hex: #rrggbb or #rgb
"cmyk(91, 61, 0, 19)"   ← cyan, magenta, yellow and black, each from 0 to 100
"rgb(23, 99, 207)"      ← red, green and blue, each from 0 to 255
"hsl(215, 80%, 45%)"    ← hue from 0 to 360, saturation and lightness from 0% to 100%
"brand"                 ← a color named in tokens
```

Each form goes wherever a color does: `color`, `background`, `fill` and `stroke`, the color of a `border` or a `shadow`, the `value` of a `color` in `tokens`, the colors of a gradient, and a value that `data-color` finds. A name that is not defined is an error.

- **Screen and print.** Hex, `rgb()` and `hsl()` are screen colors, in RGB, and `rgb()` and `hsl()` give the same PDF as their hex: `rgb(23, 99, 207)` and `hsl(215, 80%, 45%)` are both `#1763cf`. `hsl()` makes shades of one color easy: keep the hue and change the lightness. `cmyk()` is a print color: the PDF has it as the four inks, so a printer separates its plates without converting it from RGB, which shifts colors. Lpdf never converts between the two.
- **Both in one document.** RGB and CMYK colors can sit side by side, on one page or in sections of their own: `color="#1763cf"` in a section for the screen and `color="cmyk(91, 61, 0, 19)"` in one for print. A gradient is the exception: its colors are all CMYK or all RGB (see [Gradients](#gradients)).
- **Commas or spaces.** The values are separated by commas or by spaces, as in CSS: `cmyk(0, 0, 0, 100)` and `cmyk(0 0 0 100)` are the same black. One color uses one or the other, so `rgb(23, 99 207)` is an error.
- **No alpha.** A color is always solid: `rgba(23, 99, 207, 0.5)` and `rgb(23 99 207 / 50%)` are errors. Use `opacity` on a [layer](?p=doc/layer#opacity) or on a [box](?p=doc/layout#opacity), or the opacity of a `shadow`.
- **Keep print colors opaque.** Whatever is faded, a layer or a box with an `opacity` below 1 or a shadow with an opacity, is blended in RGB: its `cmyk()` colors are still written as inks, but they are converted to RGB to blend them, and so at print too. Leave the colors meant for print at full opacity.

**A color is read strictly**, so that a typo stops the render instead of printing the wrong color. Each of these is an error that names the value:

- a malformed color, such as `cmyk(0, 0, 100)` with three values, or a part that is not a number
- a value out of its range: `cmyk(0, 0, 0, 120)`, `rgb(256, 0, 0)`, or a hue past 360, which does not wrap as in CSS, so `hsl(2150, 80%, 45%)` with a digit too many is not the red that 350 would be
- a percentage in `rgb()`: `rgb(9%, 39%, 81%)`. Write 0 to 255
- `hsl()` without its `%`: `hsl(215, 0.8, 0.45)` would be a near-black gray, so the `%` is required

## Gradients

A gradient is a named blend of colors. Define it once in `gradients` inside `tokens`, and use it as `gradient:name` where a background or a fill goes. It spans the box it fills.

| `gradient` attribute | Description |
|----------------------|-------------|
| `name`               | **Required.** The name that follows `gradient:`: lowercase letters, digits and `-`, starting with a letter |
| `type`               | **Required.** `linear` or `radial` |
| `from`, `to`         | The first and the last color, for two colors: hex, `cmyk()`, `rgb()`, `hsl()` or a color name |
| `angle`              | The direction of a linear gradient, in degrees. Default `0` |

For more than two colors, give `stop` children in place of `from` and `to`. Each has an `offset`, a percentage from `0%` to `100%`, and a `color`. The offsets must increase. The first color holds up to the first stop, and the last color after the last stop.

- **Where it goes.** The `background` of `column`, `row`, `grid`, `frame`, `td`, `table`, `thead`, `tr`, `section` and `document`, and the `fill` of `rect`, `circle`, `ellipse` and `path`. A stroke, a text's `color` and the backgrounds of `barcode`, `img` and `field` take colors only, and `gradient:` there is an error.
- **Angle.** `0` runs from the top to the bottom, `90` from the left to the right, and `180` from the bottom to the top. `45` runs from the top-left corner to the bottom-right. The line is as long as the box needs, so the first and last colors reach the corners.
- **Radial.** A circle at the center of the box, out to its farthest corner: `from` is the center and `to` the edge.
- **Colors.** Any [color](#colors) or a color name, never another gradient. A color name in a gradient is looked up after the `colors` are read, so the order in `tokens` does not matter.
- **All CMYK or all RGB.** A PDF shading has one color space, so a gradient's colors are all `cmyk()`, or all hex, `rgb()` and `hsl()`. A gradient that mixes them is an error that names it, since converting one kind to the other would change the colors.
- **Pages.** A box that splits across pages gets its own gradient on each page. The `background` of a page or a section spans the page.
- **Border, shadow and opacity.** A border is drawn flat over the gradient, and a shadow under it. A box's `opacity` fades the gradient with the rest.

One document with each kind: two colors, three stops, and a radial gradient on a layer shape.

```xml
<lpdf version="1">
  <tokens>
    <gradients>
      <!-- two colors, from the left to the right -->
      <gradient name="sky" type="linear" from="#1763cf" to="#0f3e8a" angle="90"/>
      <!-- several colors: stops -->
      <gradient name="sunset" type="linear" angle="90">
        <stop offset="0%"   color="#f97316"/>
        <stop offset="55%"  color="#ec4899"/>
        <stop offset="100%" color="#8b5cf6"/>
      </gradient>
      <!-- from the center out to the farthest corner -->
      <gradient name="spotlight" type="radial" from="#ffffff" to="#1763cf"/>
    </gradients>
  </tokens>
  <document size="letter">
    <section>
      <layout margin="48pt">
        <column gap="m">
          <column padding="l" background="gradient:sky" color="#ffffff" radius="m">
            <text font-size="l">Two colors</text>
          </column>
          <column padding="l" background="gradient:sunset" color="#ffffff" radius="m">
            <text font-size="l">Three stops</text>
          </column>
        </column>
      </layout>
      <layer>
        <circle x="400pt" y="520pt" r="60pt" fill="gradient:spotlight"/>
      </layer>
    </section>
  </document>
</lpdf>
```

## BorderValue format

A border is a thickness and a color, separated by a space. The thickness is a token or a `pt` value:

```
"s #cccccc"          ← token thickness + hex color
"1.5pt #333333"      ← pt thickness + hex color
"m brand"            ← token thickness + color token
"s cmyk(0 0 0 40)"   ← token thickness + any other form of a color
```

A border with only a color, such as `"#e0e0e0"`, is an error.

## Element reference

See [All Elements](?p=xml/elements) for a full attribute reference for every element.
