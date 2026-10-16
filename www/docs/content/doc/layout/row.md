# Row

Places children side by side, each at its own width, and continues on the next line when they run out of width, like words in a paragraph. A child with `width="fill"` takes the width its line leaves, and `justify="between"` pushes a line's children apart. A row can split across pages between lines.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Vertical alignment of the children on each line: `start` `center` `end`. `stretch` acts as `start` |
| `justify`    | string  | `start` | Where each line's children sit: `start` `center` `end`, or `between`: the first at the left edge, the last at the right, and the others evenly between |
| `gap`        | token/pt | —      | Gap between items (horizontal and vertical) |
| `width`      | token/pt/`fill` | — | Constrain width. `fill` takes the full width, or what the other children leave when the row is inside another row |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `paginate`   | string   | —       | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |
| `data-source` | string | —       | Dot-path to array — repeats this element per item |

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
