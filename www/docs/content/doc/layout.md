# Layout

`layout` is the flow container inside a `section`. Elements flow top to bottom and paginate automatically — when content overflows a page, it continues on the next. A section has at most one layout. For content at a fixed place on the page, use a [layer](?p=doc/layer).

```xml
<lpdf version="1">
  <document size="letter">
    <section>
      <layout margin="48pt">
        <column gap="16pt">
          <text font-size="18pt">Title</text>
          <divider/>
          <text>Body text goes here.</text>
        </column>
      </layout>
    </section>
  </document>
</lpdf>
```

## Margin

`margin` is the space between the edges of the page and the flowing content and its regions. It takes one value for all four sides, or two to four in the order top, right, bottom, left, written like CSS: `48pt`, a space token such as `l`, `"48pt 24pt"`. Without it the layout has a margin of 36pt on every side: half an inch.

The margin belongs to the layout because only the flow uses it. The document and the section have none, and a [layer](?p=doc/layer) ignores it and measures from the page edges.

```xml
<layout margin="48pt 36pt">
  <text>Flows inside a 48pt margin at the top and bottom, and 36pt at the sides.</text>
</layout>
```

## Elements

| Element | Purpose |
|---------|---------|
| [`column`](?p=doc/layout/column) | Children top to bottom, with a gap between them |
| [`row`](?p=doc/layout/row) | Children side by side, wrapping onto new lines. A child with `width="fill"` takes what the others leave, and `justify="between"` pushes them apart |
| [`text`](?p=doc/layout/text) | Text block with optional `span` children |
| [`divider`](?p=doc/layout/divider) | Horizontal or vertical rule |
| [`frame`](?p=doc/layout/frame) | Atomic box around one child — will not split across pages |
| [`img`](?p=doc/layout/img) | Image asset |
| [`grid`](?p=doc/layout/grid) | Equal columns, filled left to right |
| [`table`](?p=doc/layout/table) | Table with rows, cells, and repeating header |
| [`barcode`](?p=doc/layout/barcode) | QR, Code128, or EAN-13 barcode |
| [`link`](?p=doc/layout/link) | Clickable hyperlink wrapper |
| [`bookmark`](?p=doc/layout/bookmark) | Entry in the PDF's outline and target for links. Draws nothing |
| [`field`](?p=doc/layout/field) | Interactive PDF form element |

## Pagination rules

- `column` — splits between children
- `table` — splits between rows, and repeats the `thead` row on each page
- `row` — splits between lines: a line of children is never cut in two
- `grid` — splits between its rows: a grid row is never cut in two
- `text` — splits between lines, keeping at least two lines on each page: see [widows and orphans](?p=doc/layout/text#widows-and-orphans)
- `bookmark` — stays with the element after it
- `frame` — atomic; moves whole to the next page if it doesn't fit
- Setting `height` on a box (a length, `fill` or `full`) also stops it splitting
- So does `paginate="no"`, and the other values of `paginate` start new pages: see [Page breaks](#page-breaks)

### Page breaks

`paginate` sets where an element falls in the page flow. The boxes (`column`, `row`, `grid`, `frame`), `text`, `img`, `barcode` and `table` take it.

| Value | Effect |
|-------|--------|
| `no` | Never split the element. When it doesn't fit, it moves whole to the next page |
| `break-before` | Start the element on a new page |
| `break-after` | Start the element that follows it on a new page |
| `keep-next` | Keep the element on one page with the element that follows it: when that one doesn't fit, both move to the next page |

`break-before`, `break-after` and `keep-next` only take effect on elements directly inside `layout`. Inside a `column` or any other box they are accepted and ignored. `no` works at any depth: a `column` with `paginate="no"` inside another column stays whole.

```xml
<layout>
  <text font-size="xl">Chapter 1</text>
  <text>The first chapter starts on the first page.</text>
  <text font-size="xl" paginate="break-before">Chapter 2</text>
  <text>Each later chapter starts on a new page.</text>
  <text font-size="l" paginate="keep-next">Summary</text>
  <column gap="s" padding="m" background="#f5f5f5" paginate="no">
    <text>The heading stays on the same page as this box,</text>
    <text>and the box is never split.</text>
  </column>
</layout>
```

- A break never adds an empty page: `break-before` on the first element of a page and `break-after` on the last element of the layout do nothing.
- An element with `break-after` that splits across pages breaks after its last part.
- On an element repeated with `data-source`, the break applies to each copy, so `break-before` puts every item on a page of its own.
- `keep-next` holds only when the two elements fit on one page together. When they don't, both stay where they would be without it. With `debug="true"` on the element, a red note in the PDF says the rule was ignored.
- An element with `no` that is taller than a page starts on a new page and runs past the bottom of it. Use `no` on elements shorter than a page.
- On a `td`, `paginate` has no effect: a table row never splits.

## Pinned regions

`region` pins content to the top or bottom of the content area, reserving space from the flow. Useful for per-page headers and footers. It is only allowed directly inside `layout`, and a page can have one per pin.

```xml
<layout>
  <region pin="top">
    <row>
      <text font-size="9pt">My Company</text>
      <text font-size="9pt" width="fill" align="right">Confidential</text>
    </row>
  </region>
  <region pin="bottom">
    <text font-size="9pt" align="center" color="#aaaaaa">Page {page} of {pages}</text>
  </region>
  <column gap="16pt">
    <text font-size="18pt">Main content</text>
    <text>Body text flows here, between the two regions.</text>
  </column>
</layout>
```

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `pin`     | string | —       | **Required.** `top` or `bottom`. `left` and `right` pass validation but are not implemented yet |
| `page`    | string | `each`  | Which pages show the region: `each`, `first`, `last`, `odd`, `even`, or a range like `2-last` |
| `debug`   | boolean | false  | Render the region's box for debugging |

In the text of a region, `{page}` becomes the page number and `{pages}` the total number of pages. Use them for "Page 2 of 5" footers. They are replaced in a region and in a layer's [`text-at`](?p=doc/layer/text-at#page-numbers), and they count within the section. A region takes its space out of the flow, inside the margin. For a page number that takes no space, or sits in the margin, use a layer.

```xml
<region pin="top" page="first">
  <text font-size="22pt">Cover page title</text>
</region>
```
