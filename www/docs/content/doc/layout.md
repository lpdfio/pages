# Layout

`layout` is the flow container inside a `section`. Elements stack vertically and paginate automatically — when content overflows a page, it continues on the next.

```xml
<lpdf version="1">
  <document size="letter" margin="48pt">
    <section>
      <layout>
        <stack gap="16pt">
          <text font-size="18pt">Title</text>
          <divider/>
          <text>Body text goes here.</text>
        </stack>
      </layout>
    </section>
  </document>
</lpdf>
```

## Elements

| Element | Purpose |
|---------|---------|
| [`stack`](?p=doc/layout/stack) | Children top to bottom, with a gap between them |
| [`flank`](?p=doc/layout/flank) | One row: every child keeps its own width except one, which fills the rest |
| [`split`](?p=doc/layout/split) | Two children side by side, at opposite edges or in equal halves |
| [`cluster`](?p=doc/layout/cluster) | Wrapping inline row |
| [`text`](?p=doc/layout/text) | Text block with optional `span` children |
| [`divider`](?p=doc/layout/divider) | Horizontal or vertical rule |
| [`frame`](?p=doc/layout/frame) | Atomic box around one child — will not split across pages |
| [`img`](?p=doc/layout/img) | Image asset |
| [`grid`](?p=doc/layout/grid) | Equal columns, filled left to right |
| [`table`](?p=doc/layout/table) | Table with rows, cells, and repeating header |
| [`barcode`](?p=doc/layout/barcode) | QR, Code128, or EAN-13 barcode |
| [`link`](?p=doc/layout/link) | Clickable hyperlink wrapper |
| [`field`](?p=doc/layout/field) | Interactive PDF form element |

## Pagination rules

- `stack` — splits between children
- `table` — splits between rows, and repeats the `thead` row on each page
- `cluster`, `grid` — split between lines and rows: a row is never cut in two
- `text` — splits between lines
- `flank`, `split`, `frame` — atomic; move whole to the next page if they don't fit
- Setting `height` on a box (a length, `fill` or `full`) also stops it splitting

## Pinned regions

`region` pins content to the top or bottom of the content area, reserving space from the flow. Useful for per-page headers and footers. It is only allowed directly inside `layout`, and a page can have one per pin.

```xml
<layout>
  <region pin="top">
    <flank>
      <text font-size="9pt">My Company</text>
      <text font-size="9pt" align="right">Confidential</text>
    </flank>
  </region>
  <region pin="bottom">
    <text font-size="9pt" align="center" color="#aaaaaa">Page {page} of {pages}</text>
  </region>
  <stack gap="16pt">
    <text font-size="18pt">Main content</text>
    <text>Body text flows here, between the two regions.</text>
  </stack>
</layout>
```

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `pin`     | string | —       | **Required.** `top` or `bottom`. `left` and `right` pass validation but are not implemented yet |
| `page`    | string | `each`  | Which pages show the region: `each`, `first`, `last`, `odd`, `even`, or a range like `2-last` |
| `debug`   | boolean | false  | Render the region's box for debugging |

In the text of a region, `{page}` becomes the page number and `{pages}` the total number of pages. Use them for "Page 2 of 5" footers. They are only replaced inside a region.

```xml
<region pin="top" page="first">
  <text font-size="22pt">Cover page title</text>
</region>
```
