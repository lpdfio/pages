# Bookmark

A `bookmark` adds an entry to the PDF's outline, the bookmarks panel of a PDF viewer, and gives links and cross-references a place to jump to. It draws nothing.

## Attributes

| Attribute | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `label`   | string  | —       | **Required.** The text of the entry, in the outline and in a [table of contents](?p=doc/toc) |
| `level`   | integer | `1`     | Depth in the outline, `1` to `6` |
| `id`      | string  | from `label` | The name a link jumps to with `href="#id"`, and a cross-reference names with `bookmark-ref="id"`. See [Ids](#ids) |
| `ref-only` | boolean | `false` | `true` leaves the bookmark out of the outline and the table of contents. Links and cross-references still reach it. See [A target for references only](#a-target-for-references-only) |

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

## Referring to a bookmark

`bookmark-ref="id"` on a [`span`](?p=doc/layout/text#inline-spans-for-mixed-styling) makes it a cross-reference: a link to the bookmark with that id, whose words say where the bookmark is. In the span's words, `{bookmark-page}` prints the page the bookmark is on, and `{bookmark-label}` prints its label. The words around them are yours.

```xml
<layout margin="48pt">
  <text>The notice period is set in <span bookmark-ref="notice">{bookmark-label}, on page {bookmark-page}</span>.</text>
  <bookmark id="notice" label="clause 4"/>
  <text paginate="break-before">4. Notice. Either party may end these terms with thirty days' notice, in writing.</text>
</layout>
```

The first line reads "The notice period is set in clause 4, on page 2.", and the whole span is a link to the clause. When an edit moves the clause to another page, the reference follows it.

- **The page is printed as the footer of that page prints it:** counted through the document, in the format and prefix of its section, so `iv` or `A-3` too. See [Page numbers](?p=doc/section#page-numbers).
- **It works wherever a span does:** in a `text`, a footnote, a [region](?p=doc/layout#pinned-regions)'s text and a layer's [`text-at`](?p=doc/layer/text-at#inline-spans-for-mixed-styling). Not in a [`code`](?p=doc/layout/code), whose text keeps its spaces and lines.
- **Errors.** An id that no bookmark has fails the render, with the line of the span. So does any other `{…}` in the span's words, such as a typo or `{page}`, and an `href` beside `bookmark-ref`: the span is a link to its bookmark already.
- **The layout settles.** Where a bookmark lands depends on the words before it, and a reference's words are among them: a longer number can wrap a line and push the bookmark to the next page. So the engine lays the document out again until each reference shows the page its bookmark is on. A reference keeps room for the widest words it has shown, so that the layout stops moving, and a number that got narrower can leave a small gap after it. A document without references is laid out once.

## A target for references only

`ref-only="true"` keeps a bookmark out of the outline and out of the [table of contents](?p=doc/toc), and keeps it a target for `href="#id"` links and for cross-references. Use it for a table or a figure that the text refers to but that has no place among the headings. Its `label` still fills `{bookmark-label}`.

```xml
<column gap="m">
  <text>The prices are in <span bookmark-ref="prices">{bookmark-label} on page {bookmark-page}</span>.</text>
  <bookmark id="prices" label="Table 3" ref-only="true"/>
  <table cols="2fr 1fr">
    <tr><td><text>Lamp oil, a barrel</text></td><td><text align="right">40.00</text></td></tr>
    <tr><td><text>Wick, a reel</text></td><td><text align="right">3.50</text></td></tr>
  </table>
</column>
```

## Ids

Without an `id`, a bookmark takes one made from its label: lowercase, with every run of characters other than letters and digits turned into one hyphen. "Data collection" becomes `data-collection`, and "§ 3.1 — Methods" becomes `3-1-methods`. When that id is taken, by an `id` set anywhere in the document or by an earlier bookmark, `-2`, `-3` and so on are added: two bookmarks labeled "Summary" get `summary` and `summary-2`.

Set `id` when a link points at the bookmark, so the link keeps working when the label changes. Two bookmarks with the same `id` are an error, and so is an empty `id`.
