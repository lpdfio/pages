# Circle / Ellipse

`circle` draws a circle by center and radius. `ellipse` draws an ellipse with separate x and y radii.

## `circle` attributes

| Attribute      | Type    | Default | Description |
|----------------|---------|---------|-------------|
| `cx`           | signed pt | —     | Center X (or offset from anchor) |
| `cy`           | signed pt | —     | Center Y (or offset from anchor) |
| `r`            | pt      | —       | **Required.** Radius |
| `anchor`       | string  | —       | Reference point |
| `fill`         | color   | —       | Fill color |
| `stroke`       | color   | —       | Stroke color |
| `stroke-width` | pt      | —       | Stroke width |
| `stroke-dash`  | string  | —       | Dash pattern |
| `opacity`      | 0–1     | 1       | Opacity |

## `ellipse` attributes

Same as `circle` except `r` is replaced by:

| Attribute | Type | Description |
|-----------|------|-------------|
| `rx`      | pt   | **Required.** Horizontal radius |
| `ry`      | pt   | **Required.** Vertical radius |

## Circle

```xml
<circle cx="100pt" cy="100pt" r="40pt" fill="#1a73e8" opacity="0.8"/>
```

## Hollow circle (stroke only)

```xml
<circle cx="306pt" cy="396pt" r="200pt" stroke="#e0e0e0" stroke-width="1pt"/>
```

## Ellipse anchored to page center

```xml
<ellipse anchor="center" rx="150pt" ry="80pt" fill="#f0f4ff" opacity="0.5"/>
```
