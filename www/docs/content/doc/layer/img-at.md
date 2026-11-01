# Image at

An image at a fixed place on the page, in a [layer](?p=doc/layer). It is the [`img`](?p=doc/layout/img) of the layout, placed by `x` and `y`.

The image must be declared in `assets` before use, with a `src` file path or bytes you load on the engine (see [Installation](?p=install#images-and-fonts)).

## Attributes

| Attribute     | Type      | Default | Description |
|---------------|-----------|---------|-------------|
| `name`        | string    | —       | **Required.** Asset name declared in `assets` |
| `x`           | signed pt | —       | X of the left edge of the image's box (or offset from anchor) |
| `y`           | signed pt | —       | Y of the top edge of the image's box (or offset from anchor) |
| `anchor`      | string    | —       | Reference point: when set, `x` and `y` are offsets, and the box's matching point is placed there |
| `width`       | pt        | —       | Width. At least one of `width` and `height` is required |
| `height`      | pt        | —       | Height |
| `data-if`     | string    | —       | Draw only when the value at the path is truthy |
| `data-if-not` | string    | —       | Draw only when the value at the path is falsy |
| `data-name` | string | — | Dot-path: picks the image from the data, among the assets declared in `assets`. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `ocg` | string | — | `print` or `screen`: shown only in print, or only on screen. See [Print and screen content](?p=print-and-screen) |

Either `anchor` or both `x` and `y` must be provided.

## One size or both

An image needs `width` or `height`. Without either the engine stops with an error: the size on a fixed page must not depend on the resolution of the image file.

- **One size given:** the other follows the image's proportions.
- **Both given:** they are a maximum. The image is never stretched: it takes the largest size that fits in them, with its own proportions, and its box becomes that size. `anchor` places that box, so a logo anchored `top-right` hugs the corner whatever its proportions.

## Logo on every page (top-right corner)

```xml
<lpdf version="1">
  <assets>
    <image name="logo" src="logo.png"/>
  </assets>
  <document size="letter">
    <section>
      <layer page="each">
        <img-at name="logo" anchor="top-right" x="-18pt" y="18pt" width="80pt" height="24pt"/>
      </layer>
      <layout margin="48pt">
        <text>Main content</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## Centered watermark image

```xml
<layer page="each" opacity="0.08">
  <img-at name="watermark" anchor="center" width="300pt" height="300pt"/>
</layer>
```
