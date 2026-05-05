# Rect

A filled or stroked rectangle on the canvas.

## Attributes

| Attribute      | Type    | Default | Description |
|----------------|---------|---------|-------------|
| `x`            | signed pt | —     | X position (or offset from anchor) |
| `y`            | signed pt | —     | Y position (or offset from anchor) |
| `w`            | pt      | —       | **Required.** Width |
| `h`            | pt      | —       | **Required.** Height |
| `anchor`       | string  | —       | Reference point — when set, x/y are offsets |
| `radius`       | pt      | —       | Corner radius |
| `fill`         | color   | —       | Fill color |
| `stroke`       | color   | —       | Stroke color |
| `stroke-width` | pt      | —       | Stroke width |
| `stroke-dash`  | string  | —       | Dash pattern: `"4 2"` |
| `opacity`      | 0–1     | 1       | Opacity |

Either `anchor` or both `x` and `y` must be provided.

## Full-page tinted background (underlay)

```xml
<canvas>
  <layer page="each">
    <rect x="0pt" y="0pt" w="612pt" h="792pt" fill="#f0f4ff" opacity="0.4"/>
  </layer>
</canvas>
```

## Border box anchored to page corners

```xml
<canvas>
  <layer page="each">
    <!-- inset border 20pt from each edge on letter size -->
    <rect x="20pt" y="20pt" w="572pt" h="752pt"
          stroke="#cccccc" stroke-width="1pt" fill=""/>
  </layer>
</canvas>
```

## Rounded highlight box

```xml
<rect x="40pt" y="100pt" w="200pt" h="60pt"
      fill="#fff8e1" stroke="#f9a825" stroke-width="1pt" radius="4pt"/>
```
