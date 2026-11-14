# Image

Embeds an image asset declared in `assets`. The image is never stretched: with one size set, the other follows its proportions, and with both set they are a maximum. With `width="fill"` it is as wide as the room it has.

## Asset declaration

Images must be declared in `assets` before use. The `src` attribute is the path of the image file, which the SDK reads from the machine that renders the PDF. To supply the bytes yourself, call `loadImage` on the engine and leave `src` out (see [Installation](?p=install#images-and-fonts)). The name uses lowercase letters, digits and `-`.

```xml
<lpdf version="1">
  <assets>
    <image name="logo" src="logo.png"/>
  </assets>
  <document size="letter">
    <section>
      <layout margin="48pt">
        <img name="logo" width="120pt"/>
      </layout>
    </section>
  </document>
</lpdf>
```

## Formats

An image is a JPEG, PNG, WebP, GIF, TIFF, BMP or SVG file. The engine tells the format from the file's bytes, whatever its name. Transparency is kept: an alpha channel, and a GIF's transparent color. An SVG is drawn as vector: see [SVG](#svg).

A JPEG goes into the PDF as it is. The other raster formats go in as their pixels, compressed without loss, so a photo saved as a lossy WebP takes several times its file's size in the PDF: save it as a JPEG where the size of the PDF matters. Their pixels count toward the render's [memory limit](?p=install#memory-limit).

A raster image draws one picture, and the engine reads the kinds of file below. The others are refused with an error that names the image and says how to save it instead:

- **PNG**: gray, RGB and RGBA at 8 or 16 bits, and a palette at 8 bits. A PNG of gray with alpha, or of fewer than 8 bits, is refused.
- **TIFF**: gray or RGB at 8 or 16 bits a sample, with alpha or without, and gray without alpha at 1, 2 or 4 bits, uncompressed or compressed with LZW, Deflate, PackBits or Group 4 fax. Samples of 32 bits, or of signed or floating-point numbers, a TIFF in CMYK, a TIFF whose pixels are compressed as JPEG, a Group 3 fax, a TIFF with a color palette, a gray TIFF with alpha that stores white as zero, and one that keeps each color in a plane of its own (Photoshop's "Per Channel" pixel order) are refused. A TIFF of several pages is refused too; a thumbnail stored in it is not a page.
- **GIF and WebP**: a still image. An animated one is refused.
- **BMP**: palettes of 1, 4 and 8 bits, run-length encoded or not, and 16, 24 and 32 bits to a pixel, with alpha when the file has an alpha mask. A BMP that holds a JPEG or a PNG is refused: load that file instead.

AVIF, HEIC and JPEG 2000 are refused.

## SVG

An SVG is drawn as vector: it stays sharp at any size, the PDF holds its shapes and not pixels, and an SVG used again is written once. The engine reads each SVG when it is loaded, so a file it can't draw is refused with an error that names the image, the tag and, where it can say, its line.

```xml
<lpdf version="1">
  <assets>
    <image name="chart" src="chart.svg"/>
  </assets>
  <document size="letter">
    <section>
      <layout margin="48pt">
        <img name="chart" width="300pt" alt="Sales by month"/>
      </layout>
    </section>
  </document>
</lpdf>
```

**Size.** The picture is as large as the `width` and `height` of its root `svg` element, else its `viewBox`, in pixels, a pixel to the point as for any image. A length in another unit is converted at 96 pixels to the inch, and the size rounds up to whole pixels, so a root that says `width="100pt"` is 134 pixels wide and draws 134pt wide when the `<img>` gives no width. An SVG with none of the three is as large as what it draws. `width` and `height` on the `<img>` size it as they do any image.

**Drawn:**

- Shapes: `path`, `line`, `polyline`, `polygon`, `rect`, `circle` and `ellipse`, and a `marker` drawn at each vertex of its path.
- Structure: `svg`, `g`, `defs`, `use` of an element of the same file, and `clipPath`, with `transform` on any element.
- Painting: `fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`, `stroke-miterlimit`, `stroke-dasharray`, `stroke-dashoffset`, `fill-rule`, `opacity`, `fill-opacity` and `stroke-opacity`, as attributes, in a `style` attribute or in a `<style>` block. The `opacity` of a group fades its shapes together.
- Colors: `#rgb`, `#rrggbb`, `rgb()`, a color name, `none` and `currentColor`, which is the color of the text where the image sits: the `color` of the nearest box, else the `text` color of the [tokens](?p=xml/schema#tokens). The one picture is drawn in each place in that place's color. A `color` the SVG sets on its root element is kept.

**Left out of the picture,** since a still picture shows none of it: `title`, `desc`, `metadata`, comments, `script`, the tags of drawing programs and animation. An SVG that only appears through its animation is drawn blank.

**Refused,** with an error that names the tag and, where it can say, its line: `text` (convert the text to outlines), an `image` inside the SVG, `foreignObject`, a gradient, `mask`, `filter`, `pattern`, `mix-blend-mode`, a `clipPath` whose shapes have different `clip-rule` values, a `clip-path` on a shape of a `clipPath`, and any reference to another file or a URL: a `use` of another file, a `url()` outside the file, an `@import`. A gradient, mask, filter or pattern the SVG defines but never uses is no reason to refuse it.

**Limits.** An SVG that expands to more than 100,000 elements, once its `use`, marker and clip path references are followed, or has more than 1,000,000 path commands, or nests more than 100 levels, `use` included, or is written with more than 400,000 XML nodes, text between the tags counted, is refused with an error that names the limit. A `use` that refers to itself is refused too.

A picture in a PDF/A, PDF/X or PDF/UA file keeps the standard: in PDF/UA it is a figure with the `alt` of its `<img>`, which it needs, as any image does.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `name`       | string  | —       | **Required.** Asset name declared in `assets` |
| `data-name` | string | — | Dot-path: picks the image from the data, among the assets declared in `assets`. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `alt`        | string  | —       | What the image shows, which a screen reader reads in a tagged document, with [`pdfua`](?p=pdfua) or a `pdfa` of [level a](?p=pdfa#level-a); `alt=""` marks it as decoration. A PDF/UA document needs it on each image outside a header or a footer; at level a without `pdfua`, an image without it is decoration. A document that is not tagged ignores it |
| `width`      | token/length/`fill` | — | Width, or `fill`: as wide as the room the image has. See [Fill the slot](#fill-the-slot). Without `height`, the height follows the image's proportions |
| `height`     | token/length | —      | Height: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). Without `width`, the width follows the image's proportions. With `width="fill"`, a limit |
| `padding`    | spacing | —       | Space around the picture, inside the box. See [Box around the picture](#box-around-the-picture) |
| `background` | color   | —       | Background of the box around the picture |
| `border`     | string  | —       | Border, drawn on the edge of the box |
| `radius`     | token/length | —      | Corner radius: rounds the box, and clips the picture to rounded corners |
| `paginate`   | string   | —      | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

## Fixed width

```xml
<img name="logo" width="100pt"/>
```

## Fixed height

```xml
<img name="photo" height="200pt"/>
```

## Both sizes: a maximum

With both `width` and `height`, they are a maximum. The image takes the largest size that fits in them with its own proportions, and its box becomes that size. The parent's `align` places it, as for any child.

```xml
<img name="logo" width="200pt" height="80pt"/>
```

To give images slots of one size, such as a row of logos each in an 80 × 40pt cell, wrap each in a `frame` of that size, which centres its child:

```xml
<row gap="m">
  <frame width="80pt" height="40pt"><img name="logo" width="80pt" height="40pt"/></frame>
  <frame width="80pt" height="40pt"><img name="photo" width="80pt" height="40pt"/></frame>
</row>
```

## Fill the slot

`width="fill"` makes the picture as wide as the room it has, and its height follows its proportions. The room is the width of the column the image is in, what the line of a row leaves after the other children, or a table cell. A picture smaller than its room grows to fill it.

```xml
<row gap="m" align="center">
  <img name="photo" width="fill"/>
  <text width="90pt">The picture takes what is left of the line.</text>
</row>
```

Several `fill` children on one line share it equally, as in any row, so two pictures with `width="fill"` are two halves of the line.

A `height` limits the picture. It takes the largest size that fits the room and the height with its own proportions, and the parent's `align` places it, as with a width and a height:

```xml
<img name="photo" width="fill" height="50pt"/>
```

## Box around the picture

An image that sets `padding`, `background` or `border` is drawn as a box around its picture. `width` and `height` size the picture, as they do for any image (one size, or both as a maximum), and the box is larger than the picture by the padding. The border is drawn on the edge of the box and takes no room, as on every box. With `width="fill"` the box takes the room, and the picture fills what the padding leaves of it.

`radius` rounds the box and clips the picture to rounded corners: the box's radius less the smallest padding, never below 0, so the picture follows the inside of the box. With no padding, background or border, `radius` clips the picture alone.

```xml
<row gap="m" align="center">
  <img name="photo" width="96pt" padding="s" background="#f5f7fa" border="xs #dde3ed" radius="m"/>
  <img name="avatar" width="64pt" height="64pt" padding="3pt" border="2pt #1763cf" radius="35pt"/>
</row>
```

## Rounded image

```xml
<img name="avatar" width="48pt" height="48pt" radius="xxl"/>
```

A picture that is not square is rounded at its own size: a `radius` larger than half its shorter side makes a pill, so give a square size for a circle.
