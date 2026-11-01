# Image

Embeds an image asset declared in `assets`. The image is never stretched: with one size set, the other follows its proportions, and with both set they are a maximum. With `width="fill"` it is as wide as the room it has.

## Asset declaration

Images must be declared in `assets` before use. The `src` attribute is the path of a PNG or JPEG file, which the SDK reads from the machine that renders the PDF. To supply the bytes yourself, call `loadImage` on the engine and leave `src` out (see [Installation](?p=install#images-and-fonts)). The name uses lowercase letters, digits and `-`.

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

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `name`       | string  | —       | **Required.** Asset name declared in `assets` |
| `data-name` | string | — | Dot-path: picks the image from the data, among the assets declared in `assets`. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `alt`        | string  | —       | What the image shows, which a screen reader reads in a [PDF/UA](?p=pdfua) document; `alt=""` marks it as decoration. A PDF/UA document needs it on each image outside a header or a footer. A document without `pdfua` ignores it |
| `width`      | token/pt/`fill` | — | Width, or `fill`: as wide as the room the image has. See [Fill the slot](#fill-the-slot). Without `height`, the height follows the image's proportions |
| `height`     | token/pt | —      | Height: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). Without `width`, the width follows the image's proportions. With `width="fill"`, a limit |
| `padding`    | spacing | —       | Space around the picture, inside the box. See [Box around the picture](#box-around-the-picture) |
| `background` | color   | —       | Background of the box around the picture |
| `border`     | string  | —       | Border, drawn on the edge of the box |
| `radius`     | token/pt | —      | Corner radius: rounds the box, and clips the picture to rounded corners |
| `paginate`   | string   | —      | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |

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
