# Path

Draws an arbitrary shape using SVG path data. Supports filled shapes, stroked outlines, and complex curves.

## Attributes

| Attribute      | Type    | Default    | Description |
|----------------|---------|------------|-------------|
| `d`            | string  | —          | **Required.** SVG path data (`M`, `L`, `C`, `A`, `Z`, …) |
| `fill`         | color   | —          | Fill color |
| `stroke`       | color   | —          | Stroke color |
| `fill-rule`    | string  | `nonzero`  | `nonzero` or `evenodd` |
| `stroke-width` | pt      | —          | Stroke width |
| `stroke-dash`  | string  | —          | Dash pattern |
| `line-cap`     | string  | `butt`     | `butt` `round` `square` |
| `opacity`      | 0–1     | 1          | Opacity |

`path` does not support `anchor`. Use absolute coordinates in the `d` attribute.

## Triangle

```xml
<path d="M 200pt 100pt L 350pt 300pt L 50pt 300pt Z"
      fill="#1a73e8" opacity="0.8"/>
```

## Arrow shape (stroked)

```xml
<path d="M 40pt 200pt L 200pt 200pt M 180pt 185pt L 200pt 200pt L 180pt 215pt"
      stroke="#333333" stroke-width="2pt" line-cap="round"/>
```

## Complex shape with a hole (evenodd fill rule)

```xml
<path d="M 100pt 100pt L 300pt 100pt L 300pt 300pt L 100pt 300pt Z
         M 150pt 150pt L 250pt 150pt L 250pt 250pt L 150pt 250pt Z"
      fill="#1a73e8" fill-rule="evenodd" opacity="0.6"/>
```

## SVG path command reference

| Command | Description |
|---------|-------------|
| `M x y` | Move to |
| `L x y` | Line to |
| `H x`   | Horizontal line to |
| `V y`   | Vertical line to |
| `C x1 y1 x2 y2 x y` | Cubic Bézier |
| `A rx ry rot large-arc sweep x y` | Arc |
| `Z`     | Close path |

Lowercase commands use relative coordinates.
