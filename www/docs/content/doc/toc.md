# Table of Contents

A section with `type="toc"` is the document's table of contents. It lists the document's [bookmarks](?p=doc/layout/bookmark) with the page each one is on, and each entry can link to its bookmark.

## How it works

The section keeps its place in the document, but the engine lays it out last, once it knows the page of every bookmark in the other sections. Its content is bound to the data `$toc`, the list of those bookmarks: repeat an element over it with `data-source="$toc"`, the way [Data Binding](?p=data/binding) repeats an element over any array.

The page numbers count the table of contents' own pages. When it runs onto a second page, the pages after it move by one, and the engine lays it out again with the new numbers.

```xml
<lpdf version="1">
  <document size="a4">
    <section type="toc">
      <layout margin="56pt">
        <column gap="m">
          <text font-size="xl">Contents</text>
          <column gap="xs">
            <column data-source="$toc">
              <link href="#">
                <row justify="between">
                  <text data-value="label">Entry</text>
                  <text data-value="page">0</text>
                </row>
              </link>
            </column>
          </column>
        </column>
      </layout>
    </section>
    <section>
      <layout margin="56pt">
        <bookmark label="Introduction"/>
        <text font-size="l">Introduction</text>
        <text>The text of the introduction.</text>
        <bookmark label="Background" level="2"/>
        <text font-size="m">Background</text>
        <text>The background.</text>
      </layout>
    </section>
    <section>
      <layout margin="56pt">
        <bookmark label="Results"/>
        <text font-size="l">Results</text>
        <text>The results.</text>
      </layout>
    </section>
  </document>
</lpdf>
```

The contents page lists Introduction and Results on pages 2 and 3, with Background under Introduction, indented, and each line jumps to its heading.

## Entries

Each item of `$toc` is one bookmark, in document order:

| Field    | Example       | Description |
|----------|---------------|-------------|
| `index`  | `1`           | The entry's place in the list, from 1 |
| `level`  | `2`           | The bookmark's `level` |
| `label`  | `Background`  | The bookmark's `label` |
| `page`   | `2`           | The page the bookmark is on, counting every page of the document from 1 |
| `anchor` | `#background` | `#` and the bookmark's id |
| `indent` | `12pt`        | The indent of the entry's level: `toc-indent-step` for each level below the first |

The bookmarks in the table of contents section itself are not in `$toc`. They are in the PDF's outline, so a bookmark on its heading lets readers and links reach the contents page:

```xml
<section type="toc">
  <bookmark label="Contents" id="contents"/>
  <layout>
    <text font-size="xl">Contents</text>
  </layout>
</section>
```

The section is bound with the data passed to `render` too, so it can show other values beside the entries. A `$toc` key in that data is replaced by the list.

## Indenting entries

Each element repeated over `$toc` gets left padding for its entry's level: `toc-indent-step` for each level below the first. The step is 12pt by default, and takes a length or a space [token](?p=xml/schema#tokens).

```xml
<section type="toc" toc-indent-step="20pt">
  <layout>
    <column data-source="$toc">
      <text data-value="label">Entry</text>
    </column>
  </layout>
</section>
```

Here a level 3 entry is indented 40pt. `toc-indent-step="0pt"` leaves every entry at the left edge.

## Links to entries

Inside an element repeated over `$toc`, `href="#"` on a [`link`](?p=doc/layout/link) or a `span` jumps to that entry's bookmark, as in the example at the top of this page. Outside a table of contents, a link to `#` goes nowhere and is left out of the PDF.

## Rules

- A document has one table of contents at most: a second `type="toc"` section is an error.
- It can be anywhere in the document. The pages before it count in the page numbers, the same as the pages after.

## In the SDKs

A table of contents is a data-bound template, and data binding works only on XML. The builders make bookmarks, `#id` links and a section with `type="toc"`, but they have no `data-source` or `data-value`, so a section they build cannot list `$toc`. Write a document with a table of contents in XML and pass it to `render`. The XML on this page works as it is in every language.
