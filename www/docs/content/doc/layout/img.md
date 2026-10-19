# Image

Embeds an image asset declared in `assets`. The image is never stretched: with one size set, the other follows its proportions, and with both set they are a maximum.

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
| `width`      | token/pt | —      | Width. Without `height`, the height follows the image's proportions |
| `height`     | pt      | —       | Height. Without `width`, the width follows the image's proportions |
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

## Box around the picture

An image that sets `padding`, `background` or `border` is drawn as a box around its picture. `width` and `height` size the picture, as they do for any image (one size, or both as a maximum), and the box is larger than the picture by the padding. The border is drawn on the edge of the box and takes no room, as on every box.

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
