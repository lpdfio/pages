# Bookmark

A `bookmark` adds an entry to the PDF's outline, the bookmarks panel of a PDF viewer, and gives links a place to jump to. It draws nothing.

## Attributes

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `label`   | string  | —       | **Required.** The text of the entry, in the outline and in a [table of contents](?p=doc/toc) |
| `level`   | integer | `1`     | Depth in the outline, `1` to `6` |
| `id`      | string  | from `label` | The name a link jumps to with `href="#id"`. See [Ids](#ids) |

## Marking a heading

A bookmark marks the element that follows it. Put it just before a heading: when the heading moves to the next page, the bookmark moves with it, so the entry never points at the bottom of the page before.

```xml
<column gap="m">
  <bookmark label="Introduction"/>
  <text font-size="xl">Introduction</text>
  <text>The text of the introduction.</text>
</column>
```

A bookmark needs an element after it in the same container. One that comes last, with nothing to mark, is an error.

## Nesting

`level` nests the entries in the outline. An entry goes under the closest entry before it with a lower level, so a level 2 bookmark sits under the level 1 bookmark before it.

```xml
<column gap="m">
  <bookmark label="Methods"/>
  <text font-size="xl">Methods</text>
  <bookmark label="Data collection" level="2"/>
  <text font-size="l">Data collection</text>
  <bookmark label="Sampling" level="3"/>
  <text font-size="m">Sampling</text>
</column>
```

## Bookmarking a section

A bookmark placed directly in a [`section`](?p=doc/section), before its layers and its `layout`, marks the section's first page. Use it for a page that has no layout to put a bookmark in, such as a cover drawn in a layer.

```xml
<document size="a4">
  <section>
    <bookmark label="Cover"/>
    <layer>
      <text-at x="56pt" y="380pt" font-size="32pt">Annual Report</text-at>
    </layer>
  </section>
</document>
```

A section takes one bookmark there, as its first child. Elsewhere, bookmarks go in a layout. A layer cannot hold one.

## Linking to a bookmark

`href="#id"` on a [`link`](?p=doc/layout/link) or a [`span`](?p=doc/layout/text#inline-spans-for-mixed-styling) jumps to the bookmark with that id.

```xml
<column gap="m">
  <text>See <span href="#results" color="#1a73e8" underline="true">Results</span> for the numbers.</text>
  <bookmark label="Results"/>
  <text font-size="xl">Results</text>
</column>
```

A link to an id that no bookmark has is left out of the PDF: its text is drawn, but it is not clickable.

## Ids

Without an `id`, a bookmark takes one made from its label: lowercase, with every run of characters other than letters and digits turned into one hyphen. "Data collection" becomes `data-collection`, and "§ 3.1 — Methods" becomes `3-1-methods`. When that id is taken, by an `id` set anywhere in the document or by an earlier bookmark, `-2`, `-3` and so on are added: two bookmarks labeled "Summary" get `summary` and `summary-2`.

Set `id` when a link points at the bookmark, so the link keeps working when the label changes. Two bookmarks with the same `id` are an error, and so is an empty `id`.
