# Section

A `section` is a run of pages inside a document. Each section paginates on its own: its content starts on a new page and continues onto as many pages as it needs. A document can have several sections with different page sizes or orientations. The page numbers count on from one section to the next: see [Page numbers](#page-numbers).

## Attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `size`        | string  | inherit | Page size override: `letter`, `legal`, `a3`, `a4`, `a5`, or a custom `"200pt 300pt"` |
| `orientation` | string  | inherit | `portrait` or `landscape` |
| `background`  | color   | inherit | Page background color |
| `footnote-counter` | string | inherit | Where the numbers of the [footnotes](?p=doc/layout/footnote) in this section start over: `page`, `section` or `document`. Overrides the document's |
| `title`       | string  | —       | Section title. Accepted, but not used: the PDF's outline takes its entries from [bookmarks](?p=doc/layout/bookmark) |
| `type`        | string  | —       | `toc` makes the section the document's [table of contents](?p=doc/toc) |
| `toc-indent-step` | token/pt | `12pt` | In a table of contents, the indent for each level below the first |
| `page-start`  | whole number | — | The number of the section's first page, which starts a new run of pages: `1` restarts the count. 1 or more. See [Page numbers](#page-numbers) |
| `page-format` | string  | the section before's | How the page numbers are written: `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman` or `upper-roman`. The first section's are decimal |
| `page-prefix` | string  | the section before's | Text before the page numbers, such as `A-`. `""` takes it away |
| `debug`       | boolean | false   | Render layout boxes for debugging |

All attributes are optional. The page settings inherit from `document` when not set.

A section holds [layers](?p=doc/layer) and at most one [`layout`](?p=doc/layout) or one [`markdown`](?p=doc/markdown), painted in the order they are written: a layer before the layout is painted under it, and a layer after it is painted over it. A section with neither is one page. Before them it can hold one [`bookmark`](?p=doc/layout/bookmark), which marks the section's first page.

The margin is not a page setting: it belongs to the layout, which is the content that keeps to it. See [`layout`](?p=doc/layout#margin).

Content always goes in a `section`. A `layout` placed directly inside `document` is an error.

## Layers and a layout

A section holds any number of [layers](?p=doc/layer) and at most one layout. They are painted in the order they are written, so each one is drawn over the ones before it. The layout creates as many pages as its content needs, and a layer is drawn on the pages its `page` selects.

```xml
<section>
  <bookmark label="Invoice"/>
  <layer>
    <!-- under the layout: the letterhead -->
    <rect x="0pt" y="0pt" width="612pt" height="12pt" fill="#1763cf"/>
  </layer>
  <layout margin="48pt">
    <text font-size="xl">Invoice</text>
  </layout>
  <layer page="each">
    <!-- over the layout, on every page -->
    <text-at anchor="bottom-right" x="-48pt" y="-24pt" font-size="9pt">Page {page} of {pages}</text-at>
  </layer>
  <layer page="last">
    <!-- over the layout and the layer before it, on the last page -->
    <line x1="48pt" y1="700pt" x2="248pt" y2="700pt" stroke="#333333"/>
    <text-at x="48pt" y="704pt" font-size="8pt">Signature</text-at>
  </layer>
</section>
```

A section with only layers is one page, such as a cover. A second `layout` in a section is an error, and a layer cannot go inside the layout. A `markdown` takes the place of the layout, for a section whose content is Markdown: a section has one or the other.

## Multiple sections

```xml
<document size="letter">
  <section>
    <layout margin="48pt">
      <text font-size="14pt">First page</text>
    </layout>
  </section>
  <section>
    <layout margin="48pt">
      <text font-size="14pt">Second page</text>
    </layout>
  </section>
</document>
```

## Mixed page sizes

```xml
<document>
  <section size="letter">
    <layout margin="48pt">
      <text>Letter page content</text>
    </layout>
  </section>
  <section size="a4">
    <layout margin="40pt">
      <text>A4 page content</text>
    </layout>
  </section>
</document>
```

## Landscape section

```xml
<section size="letter" orientation="landscape">
  <layout margin="72pt">
    <text font-size="18pt">Wide page content</text>
  </layout>
</section>
```

## Bookmarking a section

A bookmark as the section's first child adds its first page to the PDF's outline, the bookmarks panel of a viewer. A section's `title` adds no entry.

```xml
<document size="a4">
  <section>
    <bookmark label="Introduction"/>
    <layout margin="48pt">
      <text font-size="20pt">Introduction</text>
    </layout>
  </section>
  <section>
    <bookmark label="Results"/>
    <layout margin="48pt">
      <text font-size="20pt">Results</text>
    </layout>
  </section>
</document>
```

## Page numbers

A document's pages count on from one section to the next, from 1, in decimal. `{page}` in a [region](?p=doc/layout#pinned-regions) or a layer's [`text-at`](?p=doc/layer/text-at#page-numbers) prints the page's number, and `{pages}` how many pages its run has. A section changes the count only when it says so:

- **`page-start`** starts a new run at the section's first page, from the number it gives. `page-start="1"` restarts the count. A number above 1 continues a count from outside the file, such as volume 2 from page 321.
- **`page-format`** writes the numbers in `decimal` (1, 2, 3), `lower-alpha` (a, b, c), `upper-alpha` (A, B, C), `lower-roman` (i, ii, iii) or `upper-roman` (I, II, III). A new format doesn't restart the count: `page-start` does.
- **`page-prefix`** puts text before the number: `page-prefix="A-"` writes A-1, A-2.

A section that sets none of the three carries on the count, the format and the prefix of the section before. A book numbers its front matter in roman numerals from the cover, its chapters from 1 and its appendix from A-1:

```xml
<document size="a5">
  <section page-format="lower-roman">
    <layout margin="48pt">
      <text font-size="xl">The Lamplighter's Almanac</text>
      <text paginate="break-before">This page is left blank.</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section>
    <layout margin="48pt">
      <text font-size="xl">Preface</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section page-start="1" page-format="decimal">
    <layout margin="48pt">
      <text font-size="xl">Chapter 1</text>
      <text paginate="break-before">The chapter goes on.</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
  <section page-start="1" page-prefix="A-">
    <layout margin="48pt">
      <text font-size="xl">Appendix</text>
      <region pin="bottom"><text font-size="9pt" align="center">Page {page} of {pages}</text></region>
    </layout>
  </section>
</document>
```

The cover and its back say "Page i of iii" and "Page ii of iii", the preface "Page iii of iii", the chapter "Page 1 of 2" and "Page 2 of 2", and the appendix "Page A-1 of 1".

- **`{pages}`** counts the pages of a run, from one `page-start` to the next, or to the end of the document. It is written in the run's format and without the prefix, since it is a count and not a page. A file of invoices sets `page-start="1"` on each section, and each invoice says "Page 1 of 2" and "Page 2 of 2".
- **The table of contents, cross-references and the viewer** show the same numbers. A [table of contents](?p=doc/toc) prints the number each entry's page prints, and so does a [cross-reference](?p=doc/layout/bookmark#referring-to-a-bookmark) for the page of its bookmark. The PDF labels its pages with them, so the page box of a viewer shows ii or A-1, and a reader who types A-1 there goes to that page. A document whose sections set none of the three has no labels: a viewer counts 1, 2, 3 without them.
- **Letters past z** repeat one letter, aa, bb, cc, as PDF viewers count pages, where the letters of a [list](?p=doc/layout/list) go aa, ab, ac. A number past 3999 in letters or numerals is written in decimal.

## Table of contents

A section with `type="toc"` lists the document's bookmarks with their page numbers. It is laid out after the other sections, and a document can have one. See [Table of Contents](?p=doc/toc).
