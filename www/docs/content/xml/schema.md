# XML Schema

lpdf documents are described in XML. Download the schema: [lpdf.xsd](https://lpdf.io/schema/1/lpdf.xsd) (`version="1"`, what this page documents).

## Document structure

```
<lpdf version="1">
  <assets>           ← optional: fonts, images
  <tokens>           ← optional: custom scales and colors
  <document>         ← required
    <meta>           ← optional: title, author, subject, keywords, creator
    <section>+       ← one or more, each with its own pages
      <layout>       ← flow content
        …elements
      <canvas>       ← absolute positioned content
        <layer>+
          …shapes
```

A document holds sections, and a section holds a `layout`, a `canvas`, or both. The schema also allows `layout` directly inside `document` for a single section, but the engine does not accept that form yet: it stops with "unexpected element in document". Always put it in a `section`.

```xml
<document size="letter" margin="48pt">
  <section>
    <layout>
      <text>Hello world</text>
    </layout>
  </section>
</document>
```

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
| Layout lengths: `gap`, `padding`, `margin`, `width`, `height`, `font-size`, `radius`, `thickness` | `pt` or a [token](#tokens) name |
| Canvas positions and sizes: `x` `y` `w` `h` `cx` `cy` `r` `rx` `ry` `x1`…`y2`, and canvas `radius`, `stroke-width`, `font-size` | `pt`, `mm` or `in` |
| Table `cols` | `fr`, `pt` or `%` |

Layout lengths do not take `mm`, `in`, `px` or `%`: the engine stops with an "invalid space value" or "invalid width value" error. Canvas `x`, `y`, `cx`, `cy` and the line ends are signed, so they accept negative numbers: `-18pt`.

## Tokens

A token is a name for a length. Each attribute reads its own scale, so `m` is 8pt as a `gap` and 11pt as a `font-size`.

| Token | space: `gap` `padding` `margin` | text size: `font-size` | border: `border` `thickness` | `radius` | `width` | grid: `col-width` |
|-------|------|------|------|------|------|------|
| `xs`  | 2pt  | 7pt  | 0.5pt | 2pt  | 120pt | 60pt  |
| `s`   | 4pt  | 9pt  | 1pt   | 4pt  | 200pt | 100pt |
| `m`   | 8pt  | 11pt | 1.5pt | 6pt  | 280pt | 140pt |
| `l`   | 14pt | 14pt | 2pt   | 10pt | 360pt | 180pt |
| `xl`  | 20pt | 20pt | 3pt   | 16pt | 440pt | 220pt |
| `xxl` | 32pt | 28pt | 4pt   | 24pt | 515pt | 280pt |

`padding` and `margin` take one to four values, written like CSS, and each can be a token: `padding="m 24pt"` is 8pt top and bottom and 24pt left and right.

To change a scale, or to name colors, add `tokens` before `document`. A scale row needs all six values:

```xml
<lpdf version="1">
  <tokens>
    <space xs="2pt" s="6pt" m="12pt" l="18pt" xl="24pt" xxl="36pt"/>
    <colors>
      <color name="brand" value="#d76f04"/>
      <color name="text" value="#222222"/>
    </colors>
  </tokens>
  <document size="letter" margin="48pt">
    <section>
      <layout>
        <stack gap="m" padding="l" background="brand">
          <text>Uses the new scale and the named color</text>
        </stack>
      </layout>
    </section>
  </document>
</lpdf>
```

The scale elements are `space`, `text-size`, `border`, `radius`, `width` and `grid`. A color named `text` becomes the default text color.

## Colors

A color is `#rgb` or `#rrggbb`, or the name of a color in `tokens`. There is no alpha channel: use `opacity` on canvas shapes. A name that is not defined is an error.

## BorderValue format

A border is a thickness and a color, separated by a space. The thickness is a token or a `pt` value:

```
"s #cccccc"       ← token thickness + hex color
"1.5pt #333333"   ← pt thickness + hex color
"m brand"         ← token thickness + color token
```

A border with only a color, such as `"#e0e0e0"`, is an error.

## Element reference

See [All Elements](?p=xml/elements) for a full attribute reference for every element.
