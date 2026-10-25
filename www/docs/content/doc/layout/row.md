# Row

Places children side by side, each at its own width, and continues on the next line when they run out of width, like words in a paragraph. A child with `width="fill"` takes the width its line leaves, and `justify="between"` pushes a line's children apart. A row splits across pages between its lines, and through a line: see [Rows across pages](#rows-across-pages).

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment of the children on each line: `start` `center` `end`. `stretch` acts as `start` |
| `justify`    | string  | `start` | Where each line's children sit: `start` `center` `end`, or `between`: the first at the left edge, the last at the right, and the others evenly between |
| `gap`        | token/pt | —      | Gap between items (horizontal and vertical) |
| `width`      | token/pt/`fill` | — | Constrain width. `fill` takes the full width, or what the other children leave when the row is inside another row |
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
| `data-source` | string | —       | Dot-path to array — repeats this element per item |
| `data-color` | string | — | Dot-path: sets `color` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `data-background` | string | — | Dot-path: sets `background` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |

## Children that fill the rest

A child with `width="fill"` takes the width its line leaves after the other children. Several fill children on one line share that width equally. A fill child counts as no width when the row breaks its children into lines, so it never moves to the next line: the other children keep their widths, and the fill child gets what is left.

A label and its value, the value at the right edge:

```xml
<row gap="m">
  <text>Subtotal</text>
  <text width="fill" align="right">$1,200.00</text>
</row>
```

The fill child can be first. Here the title takes the space and the date sits at the right edge:

```xml
<row gap="m" align="center">
  <text width="fill" font-size="14pt">Staff Engineer, Northwind Data</text>
  <text font-size="9pt" color="#888888">2021 to present</text>
</row>
```

A bullet: a narrow marker, then text that fills the rest of the line and wraps within it:

```xml
<row gap="s">
  <text width="8pt">•</text>
  <text width="fill">Led the design of a streaming pipeline that handles fifty million events a day.</text>
</row>
```

Two fill children take half the width each. For two or more equal columns a [`grid`](?p=doc/layout/grid) does the same, but a row keeps `align`:

```xml
<row gap="24pt">
  <column gap="8pt" width="fill">
    <text font-size="s">Bill To</text>
    <text>Acme Inc</text>
    <text>123 Main St</text>
  </column>
  <column gap="8pt" width="fill">
    <text font-size="s">Ship To</text>
    <text>Acme Inc</text>
    <text>456 Depot Ave</text>
  </column>
</row>
```

## Children pushed apart

`justify="between"` puts each line's first child at the left edge and its last at the right, with the others evenly between. A line with one child starts at the left.

```xml
<row justify="between" align="center">
  <text font-size="20pt">Invoice</text>
  <text color="#888888">2026-05-04</text>
</row>
```

Each child keeps its own width, so a child too long for the space left moves to the next line. When a child can be long, such as a paragraph or text from data, give it `width="fill"` and `align="right"` instead: it stays on the line and wraps within the space.

## Rows across pages

When a page ends inside a line of a row, the line is cut there. Each child stops at its last line above the cut and goes on at the top of the row's part on the next page, at the width it had. A long bullet breaks in the middle of its text, with the marker on the first page and the text in the same place on the next.

- The cut never goes through an image, a frame, a box with a `height`, or a child with `paginate="no"`. It moves up to the top of that child, and the space under it stays blank.
- A text keeps its [widows and orphans](?p=doc/layout/text#widows-and-orphans). A marker is not left alone at the bottom of a page: when its text can't keep two lines there, the row moves to the next page whole.
- `align` places each page's part of the line on its own.
- The row's `padding`, `background` and `border` are on its part on each page.
- When the page has no such cut, the row moves to the next page whole. On a page of its own, a child taller than the page is cut at the bottom of the page, and the texts beside it go on to the next.

## Tag / badge row

```xml
<row gap="s">
  <frame padding="xs" background="#e8f0fe" radius="xs">
    <text font-size="xs" color="#1a73e8">Design</text>
  </frame>
  <frame padding="xs" background="#e8f0fe" radius="xs">
    <text font-size="xs" color="#1a73e8">Engineering</text>
  </frame>
  <frame padding="xs" background="#fce8e6" radius="xs">
    <text font-size="xs" color="#c5221f">Urgent</text>
  </frame>
</row>
```

## Dynamic tags from data

```xml
<row gap="xs" data-source="tags">
  <frame padding="xs" background="#f0f0f0" radius="xs">
    <text font-size="xs" data-value="name">Tag</text>
  </frame>
</row>
```

## Repeating rows with data binding

```xml
<column data-source="items" gap="xs">
  <row>
    <text data-value="description">Item description</text>
    <text width="fill" data-value="price" align="right">$0.00</text>
  </row>
</column>
```
