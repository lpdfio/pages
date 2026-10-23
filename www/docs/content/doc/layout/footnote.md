# Footnote

A footnote is a note at the bottom of the page. Write it where its number goes: an `fn` inside a [`text`](?p=doc/layout/text) shows a small raised number in the line, and the words it holds go at the bottom of the page where that number lands, under a short rule. The engine numbers the notes.

```xml
<text>The lamp-keepers of the northern coast kept a record of every evening they lit the harbor<fn>The record is kept in the museum at the old customs house, in forty volumes.</fn>, and the record grew longer than the harbor itself.</text>
```

`fn` takes no attributes. It holds words and [`span`](?p=doc/layout/text#inline-spans-for-mixed-styling)s, so a note can have a styled part:

```xml
<text>When a storm did come, the entries ran past the margin<fn>Some are written crosswise over the ruling, and a few <span font="Helvetica-Oblique">on the back of the page</span>.</fn>.</text>
```

## Where the notes go

The notes of a page stand at the bottom of it, in the order of their numbers, under a short rule. The number in the text is plain text in a smaller size, raised, and at the end of a line it stays with the word before it.

A page with notes has less room for its text. When the notes of a page would crowd out a line, the line moves to the next page with its note, and the page it leaves ends a little early. A note is always whole and on the page of its number. A note taller than a page is cut at the page.

## Numbering

`footnote-counter` says where the numbers start over. It is an attribute of the [`document`](?p=xml/elements#document), for all its sections, and of a [`section`](?p=doc/section), which overrides the document.

| Value | The numbers start over |
|-------|------------------------|
| `page` | on every page |
| `section` | in every section. This is the default |
| `document` | never: they run on through the document |

A section that counts across the document goes on from the notes of the earlier sections that do. A section that counts its own, or by page, takes none of them.

```xml
<lpdf version="1">
  <document size="a4" footnote-counter="document">
    <section>
      <layout margin="48pt">
        <text>This section is the first to count across the document<fn>The first note of the document.</fn>.</text>
      </layout>
    </section>
    <section>
      <layout margin="48pt">
        <text>This one goes on from the section before<fn>The second note of the document: its number is 2.</fn>.</text>
      </layout>
    </section>
    <section footnote-counter="section">
      <layout margin="48pt">
        <text>And this one counts its own<fn>Numbered 1 again.</fn>.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

## Where a footnote can go

Only a `text` of the layout can hold an `fn`. A footnote in a [table](?p=doc/layout/table), in a [region](?p=doc/layout#pinned-regions) or in a [`text-at`](?p=doc/layer/text-at) is an error that says so: put the footnotes in the texts of the layout, outside tables and regions. A region repeats on every page, so a note in it would have no page of its own.
