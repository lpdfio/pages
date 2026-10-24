# Shape

A rectangle, a circle or an ellipse in the flow, for a status dot, a color swatch or a progress bar. A shape takes room as an [image](?p=doc/layout/img) does, has no children, and is drawn centered in its box, which the parent's `align` places. For a shape at a fixed place on the page, use a [layer](?p=doc/layer): its [rect](?p=doc/layer/rect), [circle and ellipse](?p=doc/layer/circle).

```xml
<row gap="s" align="center">
  <shape type="circle" r="5pt" fill="#2f9e44"/>
  <text>Active</text>
</row>
```

## Attributes

| Attribute      | Type      | Default | Description |
|----------------|-----------|---------|-------------|
| `type`         | string    | —       | **Required.** `rect`, `circle` or `ellipse` |
| `width`        | token/pt  | —       | Width of a `rect` or an `ellipse`, which both need it. A circle takes `r` instead |
| `height`       | token/pt  | —       | Height of a `rect` or an `ellipse`, which both need it: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens). A circle takes `r` instead |
| `r`            | pt        | —       | Radius of a `circle`, which needs it. Its box is the square of side `2r` |
| `radius`       | token/pt  | —       | Corner radius of a `rect`. A circle and an ellipse are round already |
| `fill`         | color or `gradient:name` | — | Fill: a color, or a [gradient](?p=xml/schema#gradients) that spans the shape |
| `data-fill` | string | — | Dot-path: sets `fill` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `stroke`       | color     | —       | Stroke color |
| `stroke-width` | pt        | —       | Stroke width |
| `stroke-dash`  | string    | —       | Dash pattern: `"4 3"` |
| `opacity`      | 0–1       | `1`     | How opaque the shape is |
| `debug`        | boolean   | false   | Draw the box outline |

A shape with no `fill` and no `stroke` draws nothing, but keeps its box. A stroke is centered on the edge of the box, so half of it lies outside, and it takes no room. A shape that lacks what its type needs is an error that says so: a `rect` without a `width` and a `height`, or a `circle` without an `r`.

## Status dots

A circle beside a text. A `row` with `align="center"` puts the dot on the middle of the line.

```xml
<column gap="s">
  <row gap="s" align="center">
    <shape type="circle" r="5pt" fill="#2f9e44"/>
    <text>Active</text>
  </row>
  <row gap="s" align="center">
    <shape type="circle" r="5pt" fill="#f2b01e"/>
    <text>Pending review</text>
  </row>
  <row gap="s" align="center">
    <shape type="circle" r="5pt" stroke="#737373" stroke-width="1pt"/>
    <text color="#737373">Not started</text>
  </row>
</column>
```

## Color swatches

A small `rect` with a `radius` in a table cell shows the color it names.

```xml
<table cols="1fr 1fr">
  <tr>
    <td padding="s">
      <row gap="s" align="center">
        <shape type="rect" width="14pt" height="14pt" radius="2pt" fill="#1763cf"/>
        <text>primary</text>
      </row>
    </td>
    <td padding="s"><text color="#737373">#1763cf</text></td>
  </tr>
  <tr>
    <td padding="s">
      <row gap="s" align="center">
        <shape type="rect" width="14pt" height="14pt" radius="2pt" fill="#dde3ed" stroke="#737373" stroke-width="0.5pt"/>
        <text>rule</text>
      </row>
    </td>
    <td padding="s"><text color="#737373">#dde3ed</text></td>
  </tr>
</table>
```

## Progress bars

Two `rect`s side by side in a `row` of a fixed width: the part that is done and the rest. A bar of steps is a row of rounded `rect`s.

```xml
<column gap="s">
  <row gap="m" align="center">
    <row width="180pt">
      <shape type="rect" width="120pt" height="8pt" fill="#1763cf"/>
      <shape type="rect" width="60pt" height="8pt" fill="#dde3ed"/>
    </row>
    <text font-size="s" color="#737373">67%</text>
  </row>
  <row gap="m" align="center">
    <row gap="3pt">
      <shape type="rect" width="40pt" height="8pt" radius="4pt" fill="#2f9e44"/>
      <shape type="rect" width="40pt" height="8pt" radius="4pt" fill="#2f9e44"/>
      <shape type="rect" width="40pt" height="8pt" radius="4pt" fill="#2f9e44"/>
      <shape type="rect" width="40pt" height="8pt" radius="4pt" fill="#dde3ed"/>
    </row>
    <text font-size="s" color="#737373">Step 3 of 4</text>
  </row>
</column>
```

## Sizes from the tokens

`width` and `height` take a [token](?p=xml/schema#tokens): `height` reads the `height` row, so `height="m"` is 32pt unless the document changes the row. `align="end"` stands the shapes on one baseline.

```xml
<row gap="s" align="end">
  <shape type="rect" width="32pt" height="xs" fill="#1763cf"/>
  <shape type="rect" width="32pt" height="s" fill="#1763cf"/>
  <shape type="rect" width="32pt" height="m" fill="#1763cf"/>
  <shape type="rect" width="32pt" height="l" fill="#1763cf"/>
  <shape type="rect" width="32pt" height="xl" fill="#1763cf"/>
  <shape type="rect" width="32pt" height="xxl" fill="#1763cf"/>
</row>
```

## Ellipses, strokes and opacity

```xml
<row gap="xl" align="center">
  <shape type="ellipse" width="60pt" height="30pt" fill="#f5f7fa" stroke="#1763cf" stroke-width="1.5pt"/>
  <shape type="circle" r="18pt" stroke="#1f2a44" stroke-width="1pt" stroke-dash="4 3"/>
  <shape type="circle" r="16pt" fill="#1763cf" opacity="0.4"/>
</row>
```
