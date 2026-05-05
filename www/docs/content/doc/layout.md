# Layout

`layout` is the flow container inside a `section`. Elements stack vertically and paginate automatically — when content overflows a page, it continues on the next.

> **Single-section shorthand** — `layout` can appear directly inside `document` when there is only one section, as shown below. For multiple sections, wrap each in a [`section`](?p=doc/section).

```xml
<lpdf version="1">
  <document size="letter" margin="48pt">
    <layout>
      <stack gap="16pt">
        <text font-size="18pt">Title</text>
        <divider/>
        <text>Body text goes here.</text>
      </stack>
    </layout>
  </document>
</lpdf>
```

## Elements

| Element | Purpose |
|---------|---------|
| [`stack`](?p=doc/layout/stack) | Vertical stack with gap between children |
| [`flank`](?p=doc/layout/flank) | Two items: one left, one right |
| [`split`](?p=doc/layout/split) | Equal-width columns |
| [`cluster`](?p=doc/layout/cluster) | Wrapping inline row |
| [`text`](?p=doc/layout/text) | Text block with optional `span` children |
| [`divider`](?p=doc/layout/divider) | Horizontal or vertical rule |
| [`frame`](?p=doc/layout/frame) | Atomic box — will not split across pages |
| [`img`](?p=doc/layout/img) | Image asset |
| [`grid`](?p=doc/layout/grid) | Multi-column grid |
| [`table`](?p=doc/layout/table) | Table with rows, cells, and repeating header |
| [`barcode`](?p=doc/layout/barcode) | QR, Code128, or EAN-13 barcode |
| [`link`](?p=doc/layout/link) | Clickable hyperlink wrapper |
| [`field`](?p=doc/layout/field) | Interactive PDF form element |

## Pagination rules

- `stack`, `table` — split between children / rows
- `frame`, `grid` rows, `cluster` items — atomic; move whole to next page if they don't fit
- `text` — splits between lines

## Pinned regions

`region` pins a child to the top or bottom of the content area, reserving space from the flow. Useful for per-page headers and footers.

```xml
<layout>
  <region pin="top" page="each">
    <flank>
      <text font-size="9pt">My Company</text>
      <text font-size="9pt" align="right">Confidential</text>
    </flank>
  </region>
  <region pin="bottom" page="each">
    <text font-size="9pt" align="center" color="#aaaaaa">Page 1</text>
  </region>
  <stack gap="16pt">
    <text font-size="18pt">Main content</text>
    <text>Body text flows here, below the top region.</text>
  </stack>
</layout>
```

`page` accepts: `each`, `first`, `last`, `odd`, `even`, or a range like `2-last`.

> **Note:** The default for `page` is `first`. Always specify `page="each"` if you want the region to appear on every page.
