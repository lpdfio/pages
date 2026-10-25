# Grid

A multi-column grid. Children fill columns left-to-right and wrap to new rows. Grid rows are atomic — a row will not split across pages. A row taller than a page is cut at the bottom of the page, and the rows after it start the next.

Use grid for uniform card layouts. For tabular data with column headers, use [`table`](?p=doc/layout/table) instead.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `cols`       | integer | 1       | Number of columns (1–12) |
| `col-width`  | token/pt | —      | Minimum column width: the grid fits as many columns as the width allows, at least one, and stretches them to fill the row (overrides `cols`) |
| `gap`        | token/pt | —      | Gap between cells |
| `width`      | token/pt | —      | Constrain total width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color or `gradient:name` | — | Background: a color, or a [gradient](?p=xml/schema#gradients) that spans the box |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `color`      | color   | inherit | Color of the text inside. A text that sets none takes the nearest box's. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `opacity`    | 0–1     | `1`     | How opaque the box and everything in it is, as one. See [Opacity](?p=doc/layout#opacity) |
| `shadow`     | string  | —       | A hard-edged shadow under the box: `"x y color"`, with an optional opacity. See [Shadow](?p=doc/layout#shadow) |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `paginate`   | string   | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `data-source` | string | —       | Dot-path to array — repeats children per item |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |

## Three-column layout

```xml
<grid cols="3" gap="m">
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <column gap="4pt">
      <text font-size="s">Feature A</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </column>
  </frame>
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <column gap="4pt">
      <text font-size="s">Feature B</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </column>
  </frame>
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <column gap="4pt">
      <text font-size="s">Feature C</text>
      <text font-size="xs" color="#666666">Short description.</text>
    </column>
  </frame>
</grid>
```

## Data-driven grid

```xml
<grid cols="2" gap="m" data-source="products">
  <frame padding="m" border="xs #e0e0e0" radius="s">
    <column gap="4pt">
      <text font-size="s" data-value="name">Product name</text>
      <text font-size="xs" color="#666666" data-value="price">$0.00</text>
    </column>
  </frame>
</grid>
```
