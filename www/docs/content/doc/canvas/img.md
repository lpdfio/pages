# Image (canvas)

Absolutely positioned image. Both `w` and `h` are required — canvas images do not auto-size.

The image must be declared in `assets` before use.

## Attributes

| Attribute    | Type      | Default | Description |
|--------------|-----------|---------|-------------|
| `name`       | string    | —       | **Required.** Asset name declared in `assets` |
| `x`          | signed pt | —       | X position (or offset from anchor) |
| `y`          | signed pt | —       | Y position (or offset from anchor) |
| `w`          | pt        | —       | **Required.** Width |
| `h`          | pt        | —       | **Required.** Height |
| `anchor`     | string    | —       | Reference point |
| `data-value` | string    | —       | Dot-path — replaces `name` with bound value |

Either `anchor` or both `x` and `y` must be provided.

## Logo on every page (top-right corner)

```xml
<lpdf version="1">
  <assets>
    <image name="logo" src="https://example.com/logo.png"/>
  </assets>
  <document size="letter" margin="48pt">
    <section>
      <layout>
        <text>Main content</text>
      </layout>
      <canvas>
        <layer page="each">
          <img name="logo" anchor="top-right" x="-18pt" y="18pt" w="80pt" h="24pt"/>
        </layer>
      </canvas>
    </section>
  </document>
</lpdf>
```

## Centered watermark image

```xml
<canvas>
  <layer page="each" opacity="0.08">
    <img name="watermark" anchor="center" w="300pt" h="300pt"/>
  </layer>
</canvas>
```
