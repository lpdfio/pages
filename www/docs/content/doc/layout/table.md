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
| `background` | color   | —       | Background behind the whole table |
| `width`      | token/pt | —      | Constrain table width |

## `thead` attributes

A `thead` row is repeated at the top of each page. It takes the same `background` as `tr`.

## `tr` attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `background`  | color   | —       | Row background |
| `data-source` | string  | —       | Dot-path to array — repeats this row per item |
| `data-if`     | string  | —       | Render only when value is truthy |
| `data-if-not` | string  | —       | Render only when value is falsy |

## `td` attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | fill    | Horizontal: `start` `center` `end`. By default children fill the cell width |
| `valign`     | string  | `top`   | Vertical: `top` `middle` `bottom` |
| `background` | color   | —       | Cell background |
| `padding`    | spacing | —       | Cell inner padding |
| `border`     | string  | —       | Cell border |

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
