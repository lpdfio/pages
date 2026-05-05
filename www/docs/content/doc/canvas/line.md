# Line

A straight line between two points. All four coordinate attributes are required — `line` does not support `anchor`.

## Attributes

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `x1`           | signed pt | —       | **Required.** Start X |
| `y1`           | signed pt | —       | **Required.** Start Y |
| `x2`           | signed pt | —       | **Required.** End X |
| `y2`           | signed pt | —       | **Required.** End Y |
| `stroke`       | color     | —       | Line color |
| `stroke-width` | pt        | —       | Line thickness |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 2"` (4pt dash, 2pt gap) |
| `line-cap`     | string    | `butt`  | `butt` `round` `square` |

## Horizontal rule on each page

```xml
<canvas>
  <layer page="each">
    <!-- rule 48pt from the bottom, spanning the full letter width -->
    <line x1="0pt" y1="744pt" x2="612pt" y2="744pt"
          stroke="#e0e0e0" stroke-width="0.5pt"/>
  </layer>
</canvas>
```

## Dashed separator

```xml
<line x1="40pt" y1="200pt" x2="572pt" y2="200pt"
      stroke="#aaaaaa" stroke-width="1pt" stroke-dash="6 3"/>
```

## Diagonal accent

```xml
<line x1="0pt" y1="0pt" x2="100pt" y2="100pt"
      stroke="#1a73e8" stroke-width="2pt" line-cap="round"/>
```
