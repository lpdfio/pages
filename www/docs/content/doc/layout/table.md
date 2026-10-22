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
