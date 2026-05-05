# Image

Embeds an image asset declared in `assets`. Width and height are constraints — the image scales proportionally unless both are set.

## Asset declaration

Images must be declared in `assets` before use. The `src` attribute accepts a URL or a base64 data URI.

```xml
<lpdf version="1">
  <assets>
    <image name="logo" src="https://example.com/logo.png"/>
  </assets>
  <document size="letter" margin="48pt">
    <layout>
      <img name="logo" width="120pt"/>
    </layout>
  </document>
</lpdf>
```

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `name`       | string  | —       | **Required.** Asset name declared in `assets` |
| `width`      | token/pt | —      | Constrain width (aspect ratio preserved unless height also set) |
| `height`     | pt      | —       | Constrain height |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background behind image |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius (clips image) |
| `data-value` | string  | —       | Dot-path — replaces `name` with bound value at render time |

## Fixed width

```xml
<img name="logo" width="100pt"/>
```

## Fixed height

```xml
<img name="photo" height="200pt"/>
```

## Rounded image

```xml
<img name="avatar" width="48pt" height="48pt" radius="xxl"/>
```
