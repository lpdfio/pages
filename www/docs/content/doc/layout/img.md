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
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background behind image |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius (clips image) |
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

## Rounded image

```xml
<img name="avatar" width="48pt" height="48pt" radius="xxl"/>
```
