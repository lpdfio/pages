# Section

A `section` is a run of pages inside a document. Each section paginates on its own: its content starts on a new page and continues onto as many pages as it needs. A document can have several sections with different page sizes or orientations.

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
| `debug`       | boolean | false   | Render layout boxes for debugging |

All attributes are optional. The page settings inherit from `document` when not set.

A section holds [layers](?p=doc/layer) and at most one [`layout`](?p=doc/layout), painted in the order they are written: a layer before the layout is painted under it, and a layer after it is painted over it. A section with no layout is one page. Before them it can hold one [`bookmark`](?p=doc/layout/bookmark), which marks the section's first page.

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

A section with only layers is one page, such as a cover. A second `layout` in a section is an error, and a layer cannot go inside the layout.

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

## Table of contents

A section with `type="toc"` lists the document's bookmarks with their page numbers. It is laid out after the other sections, and a document can have one. See [Table of Contents](?p=doc/toc).
