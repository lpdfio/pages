# Bulk Records

For ledgers, logs, audit exports and label sheets of tens of thousands of records and more, `bulk="true"` on a table, list, grid or column lays out the records of its child with `data-source` a page at a time, straight from the data.

## When to use it

Without `bulk`, [`data-source`](?p=data/binding) copies its element once for every record, and the engine holds every copy until the PDF is written. A table of 240,000 rows then runs past the SDKs' default limits of 5 seconds and 1,024 MB. With `bulk`, the repeated element is a template, the records stay as data, and the engine reads only the records of the page it is on. On a laptop, the same 240,000 rows render in about 3 seconds within the default limits.

In return, a bulk container keeps to [the rules](#the-rules): plain text, a bounded height for each record, and no nesting. Breaking a rule is an error that names it, never a quiet fallback.

## A ledger

```xml
<section>
  <layout margin="40pt">
    <text font-size="l" bold="true">Ledger 2026</text>
    <table cols="80pt 5fr 2fr" stripe="#f2f5f9" bulk="true">
      <thead background="#1763cf">
        <td padding="s"><text bold="true" color="#ffffff">Date</text></td>
        <td padding="s"><text bold="true" color="#ffffff">Description</text></td>
        <td padding="s"><text bold="true" color="#ffffff" align="right">Amount</text></td>
      </thead>
      <tr data-source="entries">
        <td padding="s"><text data-value="date">2026-01-04</text></td>
        <td padding="s"><text data-value="description" max-lines="2" ellipsis="true">Office supplies</text></td>
        <td padding="s"><text align="right" data-value="amount">$120.00</text></td>
      </tr>
    </table>
    <text align="right" bold="true" data-value="total">$1,204,330.00</text>
    <region pin="bottom">
      <text font-size="s" align="right">Page {page} of {pages}</text>
    </region>
  </layout>
</section>
```

```json
{
  "total": "$1,204,330.00",
  "entries": [
    { "date": "2026-01-04", "description": "Office supplies", "amount": "$120.00" },
    { "date": "2026-01-04", "description": "Travel, Berlin", "amount": "$842.10" }
  ]
}
```

Only `bulk` is new: the rest is the markup of any table bound to data. The header row repeats on every page, the stripes run on from page to page, the title starts the first page and the total follows the last row. `{pages}` prints the total of the document's pages on every page. Rendered without data, the template is laid out once, as an element with `data-source` is.

## Where it goes

| Container with `bulk` | What repeats | A record is |
|---|---|---|
| `table` | a `tr` | a row of cells, each with one text or none |
| `list` | an `li` | an item of texts, with its bullet or number; a number list numbers the records on from the items before them |
| `grid` | its child | a cell, `cols` of them to a row: a text, or a column of texts, such as a label's name, street and town |
| `column` | a `text` | a text |

A log as a number list, and labels as a grid of cells of one height:

```xml
<list type="number" bulk="true">
  <li data-source="events">
    <text data-value="line" max-lines="2" ellipsis="true">2026-03-01 08:00:00 sign-in from 10.0.0.4</text>
  </li>
</list>
```

```xml
<grid cols="3" gap="6pt" bulk="true">
  <column data-source="addresses" height="72pt" padding="m" border="0.5pt #c5ccd6">
    <text bold="true" data-value="name">Ada Lovelace</text>
    <text data-value="street">12 St James's Square</text>
    <text data-value="city">London</text>
  </column>
</grid>
```

## The pages

The pages are the ones the same document has without `bulk`, with one difference: a record never splits across pages. Where a page ends inside a list item, between its texts or inside a text of four lines or more, the document without `bulk` splits it there, and with `bulk` the record moves whole to the next page. Rows of a table and rows of a grid never split either way, so their pages are always the same.

## The rules

The container:

- sits directly in the layout of a section: not in a column, a row, a cell, a region or another container.
- has no `data-source` of its own, and exactly one child with it, the template. Its other children, such as a header row, a total row or an item before the records, keep the same rules as a record.
- takes its height from its records: it has no `height`.
- as a table, sets its `cols` in `fr`, `pt` or `%`. A column of `auto` width would need every record first.
- has no `paginate`, and neither has anything in it.

Each record, and each of the container's other children:

- holds only text, as the table under [Where it goes](#where-it-goes) says, with one level: no images, barcodes, shapes, code, rows, lists, tables or grids, and in a table one text to a cell.
- holds plain words: no `span`, link, bookmark, footnote or reference to a bookmark inside it. A text keeps its own attributes, such as `font`, `font-size`, `bold`, `color`, `align`, `line-height`, `max-lines` and `ellipsis`, and so does what only paints, such as padding, borders, backgrounds, stripes and `colspan`.
- sets no `widows` or `orphans`, since a record never splits.
- has no `rowspan`, which ties records together, no `keep` on a row, and no `data-source` inside it.
- may use `data-if` and `data-if-not`, such as a line shown for some records only.

A text in a bulk container without `max-lines` holds one line and ends in "…" when its value is longer, so a record's height is known before its words are laid out. Set `max-lines` to give a text more lines.

The document has no table of contents and no reference to a bookmark, which lay the document out again until its page numbers settle, and is not tagged: no [`pdfua`](?p=pdfua), and no `pdfa` of [level a](?p=pdfa#level-a). A section with a bulk container in [columns](?p=doc/section#columns) fills them in order (`column-fill="auto"`, the default), not balanced.

Each rule names itself when it is broken, with the element that breaks it:

```
<column> at line 12, col 5: a bulk column holds plain words: its repeated text holds a span
```
