# Table

Tabular data with explicit column widths, an optional repeating header, and automatic pagination. Tables split between rows — a row will not split mid-cell.

## Structure

```
<table cols="…">
  <thead>          ← optional; repeats at top of each page
    <td>…</td>
    <td>…</td>
  </thead>
  <tr>             ← data row
    <td>…</td>
    <td>…</td>
  </tr>
</table>
```

## `table` attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `cols`       | string  | —       | **Required.** Space-separated column widths: `"2fr 1fr 80pt"` or `"40% 60%"` |
| `border`     | string  | —       | Grid lines between and around the cells |
| `stripe`     | color   | —       | Alternating row background |
| `gap`        | token/pt | —      | Space between columns and between rows |
| `padding`    | spacing | —       | Space between the table's edge and its content. This is not cell padding: set `padding` on each `td` |
| `background` | color or `gradient:name` | — | Background behind the whole table: a color, or a [gradient](?p=xml/schema#gradients) that spans the table |
| `width`      | token/pt | —      | Constrain table width |
| `paginate`   | string   | —      | Page breaks: `no` `break-before` `break-after` `keep-next`. See [Page breaks](?p=doc/layout#page-breaks) |

## `thead` attributes

A `thead` row is repeated at the top of each page. It takes the same `background` as `tr`: a color, or a [gradient](?p=xml/schema#gradients) that spans the row.

## `tr` attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `background`  | color or `gradient:name` | — | Row background: a color, or a [gradient](?p=xml/schema#gradients) that spans the row |
| `keep`        | string  | —       | `with-next` keeps the row on the same page as the row after it. See [Keeping rows together](#keeping-rows-together) |
| `data-source` | string  | —       | Dot-path to array — repeats this row per item |
| `data-if`     | string  | —       | Render only when value is truthy |
| `data-if-not` | string  | —       | Render only when value is falsy |

## `td` attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | fill    | Horizontal: `start` `center` `end`. By default children fill the cell width |
| `valign`     | string  | `top`   | Vertical: `top` `middle` `bottom` |
| `colspan`    | integer | `1`     | How many columns the cell spans. See [Spanning columns](#spanning-columns) |
| `rowspan`    | integer | `1`     | How many rows the cell spans. See [Spanning rows](#spanning-rows) |
| `background` | color or `gradient:name` | — | Cell background: a color, or a [gradient](?p=xml/schema#gradients) that spans the cell |
| `padding`    | spacing | —       | Cell inner padding |
| `border`     | string  | —       | Cell border |
| `color`      | color   | inherit | Color of the text in the cell. See [Text color in a box](?p=doc/layout#text-color-in-a-box) |
| `opacity`    | 0–1     | `1`     | How opaque the cell and everything in it is. See [Opacity](?p=doc/layout#opacity) |
| `shadow`     | string  | —       | A hard-edged shadow under the cell. See [Shadow](?p=doc/layout#shadow) |

## Keeping rows together

A table breaks only between rows. A row that does not fit on the page goes to the next page whole, and a header is never left alone at the bottom of a page: when there is no room for the header and a row under it, the table starts on the next page. Both hold without any attribute.

`keep="with-next"` on a `tr` keeps it on the same page as the row after it. Put it on a group heading, so that it never ends a page above its first item, and on the rows above a total, so that the total never stands alone:

```xml
<table cols="3fr 1fr 1fr" border="xs #e0e0e0">
  <thead background="#f0f0f0">
    <td padding="xs"><text font-size="xs">Description</text></td>
    <td padding="xs" align="end"><text font-size="xs">Qty</text></td>
    <td padding="xs" align="end"><text font-size="xs">Amount</text></td>
  </thead>
  <tr keep="with-next" background="#f9f9f9">
    <td padding="xs"><text font-size="xs" bold="true">Design</text></td>
    <td padding="xs"><text font-size="xs"> </text></td>
    <td padding="xs"><text font-size="xs"> </text></td>
  </tr>
  <tr>
    <td padding="xs"><text font-size="xs">Wireframes</text></td>
    <td padding="xs" align="end"><text font-size="xs">12</text></td>
    <td padding="xs" align="end"><text font-size="xs">$2,400.00</text></td>
  </tr>
  <tr keep="with-next">
    <td padding="xs"><text font-size="xs">Subtotal</text></td>
    <td padding="xs"><text font-size="xs"> </text></td>
    <td padding="xs" align="end"><text font-size="xs">$2,400.00</text></td>
  </tr>
  <tr>
    <td padding="xs"><text font-size="xs" bold="true">Total due</text></td>
    <td padding="xs"><text font-size="xs"> </text></td>
    <td padding="xs" align="end"><text font-size="xs" bold="true">$2,400.00</text></td>
  </tr>
</table>
```

A run of rows that each say `with-next`, and the row that ends it, form a group. When a page break would fall inside a group, the whole group moves to the next page, under the header that the table repeats there. A group taller than a page cannot stay together: it breaks between its rows as if it had no `keep`. On the last row of a table, `keep` has no effect.

## Spanning columns

`colspan="n"` on a `td` makes the cell span `n` columns. It is as wide as those columns and the gaps between them, and the cells after it in the row start at the column after its last. Use it for a heading across the whole table, and for a label that sits before an amount:

```xml
<table cols="4fr 1fr 2fr 2fr" border="xs #e0e0e0">
  <thead background="#f0f0f0">
    <td padding="xs"><text font-size="xs">Description</text></td>
    <td padding="xs" align="end"><text font-size="xs">Qty</text></td>
    <td padding="xs" align="end"><text font-size="xs">Price</text></td>
    <td padding="xs" align="end"><text font-size="xs">Amount</text></td>
  </thead>
  <tr background="#f9f9f9">
    <td colspan="4" padding="xs"><text font-size="xs" bold="true">Design</text></td>
  </tr>
  <tr>
    <td padding="xs"><text font-size="xs">Wireframes</text></td>
    <td padding="xs" align="end"><text font-size="xs">12</text></td>
    <td padding="xs" align="end"><text font-size="xs">$200.00</text></td>
    <td padding="xs" align="end"><text font-size="xs">$2,400.00</text></td>
  </tr>
  <tr>
    <td colspan="3" padding="xs" align="end"><text font-size="xs">Subtotal</text></td>
    <td padding="xs" align="end"><text font-size="xs">$2,400.00</text></td>
  </tr>
  <tr>
    <td colspan="3" padding="xs" align="end"><text font-size="xs" bold="true">Total due</text></td>
    <td padding="xs" align="end"><text font-size="xs" bold="true">$2,400.00</text></td>
  </tr>
</table>
```

A cell without `colspan` takes one column, and a span can start anywhere in a row: the first cell, one in the middle or the last. A row whose cells span more columns than `cols` names is an error that says how many columns the row spans and how many the table has. A row with fewer leaves its last columns empty.

`colspan` changes widths only. A row is as tall as its tallest cell at the width that cell has, and page breaks, `keep` and the repeated header work as they do without it. With a `border`, the grid has no line inside a spanning cell.

## Spanning rows

`rowspan="n"` on a `td` makes the cell span `n` rows: its own and the `n - 1` under it. It is as tall as those rows and the gaps between them. The rows under it leave its column out, and their cells start at the first free columns, so such a row has fewer cells than the table has columns. Use it for a label that belongs to a group of rows, and for a note that covers several of them:

```xml
<table cols="1fr 2fr 2fr 4fr" border="xs #e0e0e0">
  <thead background="#f0f0f0">
    <td padding="xs"><text font-size="xs">Quarter</text></td>
    <td padding="xs"><text font-size="xs">Month</text></td>
    <td padding="xs" align="end"><text font-size="xs">Revenue</text></td>
    <td padding="xs"><text font-size="xs">Notes</text></td>
  </thead>
  <tr>
    <td rowspan="3" padding="xs"><text font-size="xs" bold="true">Q1</text></td>
    <td padding="xs"><text font-size="xs">January</text></td>
    <td padding="xs" align="end"><text font-size="xs">$41,200.00</text></td>
    <td rowspan="2" padding="xs"><text font-size="xs">Slow start after the holidays.</text></td>
  </tr>
  <tr>
    <td padding="xs"><text font-size="xs">February</text></td>
    <td padding="xs" align="end"><text font-size="xs">$38,900.00</text></td>
  </tr>
  <tr>
    <td padding="xs"><text font-size="xs">March</text></td>
    <td padding="xs" align="end"><text font-size="xs">$44,100.00</text></td>
    <td padding="xs"><text font-size="xs">Spring catalogue sent.</text></td>
  </tr>
</table>
```

The second row has two cells, since the label holds the first column and the note the last. A cell can span columns and rows at once (`colspan="2" rowspan="2"`). These are errors, and the message says which: a row with more cells than the span leaves free columns for, a `colspan` that no free columns are wide enough for, a span that runs past the last row of the table, and a `rowspan` on a `thead`, which is a single row. Spans are checked in the document as it is written, before data binds, so a `data-source` that changes the number of rows can leave a row with a cell too many. The cell with no column is left out.

If the content of a spanning cell is taller than the rows it spans together, the last of them grows by the difference. If it is shorter, the cell is stretched to the rows, and `valign` places its content among all of them.

The rows a cell spans stay on one page. When they do not fit in what is left of a page, they move to the next page together, under the repeated header, and a row with `keep="with-next"` just above them goes with them. Rows that a cell spans and that are taller than a page are placed whole where they start a page, and the page clips what runs past its end. With a `border`, the grid has no line across a spanning cell: neither the rule under a row nor a rule between two columns inside it.

## Invoice line items

```xml
<table cols="3fr 1fr 1fr" border="xs #e0e0e0" stripe="#f9f9f9">
  <thead background="#f0f0f0">
    <td padding="xs"><text font-size="xs">Description</text></td>
    <td padding="xs" align="end"><text font-size="xs">Qty</text></td>
    <td padding="xs" align="end"><text font-size="xs">Amount</text></td>
  </thead>
  <tr data-source="items">
    <td padding="xs"><text data-value="description">Item</text></td>
    <td padding="xs" align="end"><text data-value="qty">1</text></td>
    <td padding="xs" align="end"><text data-value="amount">$0.00</text></td>
  </tr>
</table>
```

## Column width units

| Unit | Meaning |
|------|---------|
| `fr` | Fraction of remaining width (like CSS fr) |
| `pt` | Fixed point width |
| `%`  | Percentage of table width |

Mixing units is supported: `"2fr 80pt 20%"`.
