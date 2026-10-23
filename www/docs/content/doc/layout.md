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
| [`shape`](?p=doc/layout/shape) | Rectangle, circle or ellipse that takes room in the flow: a status dot, a swatch, a progress bar |
| [`grid`](?p=doc/layout/grid) | Equal columns, filled left to right |
| [`table`](?p=doc/layout/table) | Table with rows, cells, and repeating header |
| [`barcode`](?p=doc/layout/barcode) | QR, Code128, or EAN-13 barcode |
| [`link`](?p=doc/layout/link) | Clickable hyperlink wrapper |
| [`bookmark`](?p=doc/layout/bookmark) | Entry in the PDF's outline and target for links. Draws nothing |
| [`fn`](?p=doc/layout/footnote) | Footnote inside a `text`: a raised number in the line, the note at the bottom of the page |
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

## Text color in a box

A box can set the color of the text inside it. `color` on a `column`, `row`, `grid`, `frame` or `td` is taken by every `text` inside that sets none of its own, however deep. A text takes the color of the nearest box that sets one, else the `text` color of [`tokens`](?p=xml/schema#tokens), which is `#1a1a1a` unless the document redefines it. A divider or a barcode in the box keeps its own color.

`font` and `font-size` on a box are inherited the same way. `align` is not: on a box it places the children, so a `text` does not take its alignment from the box around it.

```xml
<column gap="xs" padding="m" background="#1763cf" color="#ffffff" radius="s">
  <text font-size="l" font="Helvetica-Bold">White on blue</text>
  <text>Every text in the card takes the white.</text>
  <text color="#ffd54f">Except one that sets its own.</text>
</column>
```

## Opacity

`opacity` fades a box and everything in it as one, from `1` (the default) to `0`. Where the children overlap they do not show through each other, and a box inside a faded box is faded further: `0.5` inside `0.5` is drawn at `0.25`. A link in the box stays clickable, and a form field in it is not faded. A box at `0` draws nothing.

```xml
<column gap="s">
  <column padding="m" background="#1763cf" opacity="0.4">
    <text color="#ffffff">A box at 40%, text and all.</text>
  </column>
  <column padding="m" background="#1763cf" opacity="0.5">
    <column padding="m" background="#cc0000" opacity="0.5">
      <text color="#ffffff">0.5 inside 0.5, drawn at 0.25.</text>
    </column>
  </column>
</column>
```

A [layer](?p=doc/layer#opacity) has `opacity` too. A shape or a `-at` element in a layer has none: put it in a layer of its own.

## Shadow

`shadow` draws a hard-edged copy of a box under it: `"x y color"`, with an optional opacity from 0 to 1 after the color that fades the shadow alone. `x` and `y` are signed lengths: positive is right and down, and negative is left and up. `shadow="3pt 3pt #000000 0.2"` is a black shadow 3pt right and down, at 20%.

- There is no blur. The copy has the box's `radius`.
- A shadow takes no room in the layout. It can run into a margin or a neighbor, and the siblings after the box are drawn over it, so leave the space yourself.
- A box with no background shows its shadow only outside it.
- The box's own `opacity` fades the box and its shadow together.

The shapes of a [layer](?p=doc/layer/rect) (`rect`, `circle` and `ellipse`) take `shadow` too.

```xml
<column gap="xs" padding="m" background="#ffffff" border="xs #e0e0e0" radius="m" shadow="3pt 3pt #000000 0.15">
  <text font-size="m" font="Helvetica-Bold">Card title</text>
  <text font-size="s" color="#666666">A card with a border, rounded corners and a shadow.</text>
</column>
```

## Pinned regions

`region` pins content to the top or bottom of the content area, reserving space from the flow. Useful for per-page headers and footers. It is only allowed directly inside `layout`. `pin` chooses the edge wherever the region is written among the flow, and regions on one edge stack in the order they are written: a header and a first-page banner can both be `pin="top"`.

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

## Running headers

A header or a footer can show text from its own page, such as the title of the chapter it is on, or the first and last entry of a dictionary page. Mark the source in the flow with `capture`, and show it in a region with `capture-ref`.

| Attribute | On | Meaning |
|-----------|----|---------|
| `capture="name"` | a `text` in the flow | Records the words of the text under that name, as the pages are filled |
| `capture-ref="name"` | a `text` in a `region` | Shows what was recorded under the name, as of the page it is drawn on. It has no words of its own |
| `capture-mode` | the `capture-ref` text | `first` or `last` (default): which of the texts captured under the name on that page it shows |
| `capture-fallback` | the `capture-ref` text | What it shows until something has been captured in the section. Nothing by default |

The chapter title in the header of every page:

```xml
<layout>
  <region pin="top">
    <row gap="m">
      <text width="fill" font-size="s" color="#737373" capture-ref="chapter" capture-fallback="Front matter"/>
      <text font-size="s" color="#737373">Page {page}</text>
    </row>
  </region>
  <column gap="m">
    <text font-size="xl" capture="chapter">Chapter 1: The Lamp Room</text>
    <text>The text of the first chapter runs here, and onto as many pages as it needs. Every page of it shows its chapter in the header.</text>
  </column>
  <column gap="m" paginate="break-before">
    <text font-size="xl" capture="chapter">Chapter 2: The Record</text>
    <text>The second chapter starts a page, and from there the header reads its title.</text>
  </column>
</layout>
```

A dictionary page shows its first and last entry. Every entry carries the same name, and the header asks for each end: `first` and `last` are two texts on one name.

```xml
<layout>
  <region pin="top">
    <row gap="s">
      <text width="fill" align="right" font-size="s" capture-ref="entry" capture-mode="first"/>
      <text font-size="s">–</text>
      <text width="fill" font-size="s" capture-ref="entry" capture-mode="last"/>
    </row>
  </region>
  <column gap="xs" paginate="no">
    <text font="Helvetica-Bold" capture="entry">Abacus</text>
    <text>A frame of rods and sliding beads used for counting.</text>
  </column>
  <column gap="xs" paginate="no">
    <text font="Helvetica-Bold" capture="entry">Abbey</text>
    <text>A building where monks or nuns live, work and pray.</text>
  </column>
</layout>
```

How a header chooses what to show:

- The page that holds a capture counts it, the words above it on that page included.
- A page where nothing is captured under the name shows the latest value of an earlier page, whichever `capture-mode` it has. Before any capture it shows `capture-fallback`.
- A text that splits across pages is recorded on the page where it starts.
- A table's `thead` that repeats on each page the table continues on records its `capture` once, on the page where the table starts. The copies on the later pages are drawn but capture nothing, so they do not put the header's words back over what the rows captured since.
- Each section starts with nothing captured, so a header's value does not carry from one section into the next.
- `capture`, `capture-ref`, `capture-mode` and `capture-fallback` are attributes of the layout's `text`, not of a layer's `text-at`.
- A text with `capture-ref` always takes its line, whatever it shows, so the header is the same height on every page: one line, or `max-lines` of them. A longer value is cut at that, and ends in dots with `ellipsis="true"`. A text cannot have both `capture` and `capture-ref`.
