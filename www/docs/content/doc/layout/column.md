# Column

Places children top to bottom with a configurable gap. By default each child fills the available width. A column can split across pages between its children.

## Attributes

| Attribute    | Type    | Default  | Description |
|--------------|---------|----------|-------------|
| `gap`        | token/pt | —       | Space between children: `xs` `s` `m` `l` `xl` `xxl` or `12pt` |
| `align`      | string  | `stretch` | Cross-axis alignment: `start` `center` `end` `stretch` |
| `justify`    | string  | `start`  | Main-axis distribution: `start` `center` `end` `between` |
| `width`      | token/pt/`fill` | — | Fixed width, or `fill`: the full width, and in a [`row`](?p=doc/layout/row#children-that-fill-the-rest) the width the other children leave |
| `padding`    | spacing | —        | Inner padding: `16pt` or shorthand `"16pt 12pt"` |
| `background` | color or `gradient:name` | — | Background: a color, or a [gradient](?p=xml/schema#gradients) that spans the box |
| `border`     | string  | —        | Border: `"s #cccccc"` or `"1pt #cccccc"` |
| `radius`     | token/pt | —       | Corner radius |
| `color`      | color   | inherit | Color of the text inside. A text that sets none takes the nearest box's. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `opacity`    | 0–1     | `1`     | How opaque the box and everything in it is, as one. See [Opacity](?p=doc/layout#opacity) |
| `shadow`     | string  | —       | A hard-edged shadow under the box: `"x y color"`, with an optional opacity. See [Shadow](?p=doc/layout#shadow) |
| `height`     | pt/`fill`/`full` | — | Fixed height, fill remaining space, or full page height |
| `paginate`   | string           | — | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `font`       | string  | inherit  | Font name (declared in `assets`) |
| `font-size`  | token/pt | inherit | Font size for all children |
| `data-source` | string | —       | Dot-path to array — repeats this element per item |
| `data-if`    | string  | —        | Render only when value is truthy |
| `data-if-not` | string | —       | Render only when value is falsy |

## Basic example

```xml
<column gap="16pt">
  <text font-size="18pt">Title</text>
  <divider/>
  <text>Body text.</text>
</column>
```

## Centered content

```xml
<column gap="12pt" align="center">
  <text>Centered item</text>
  <text>Also centered</text>
</column>
```

## Space between (like flex justify-content: space-between)

```xml
<column justify="between" height="full">
  <text>Top</text>
  <text>Bottom</text>
</column>
```

## Card with background and border

```xml
<column gap="8pt" padding="m" background="#f8f9fa" border="xs #e0e0e0" radius="s">
  <text font-size="s">Card title</text>
  <text font-size="xs" color="#666666">Supporting text.</text>
</column>
```
