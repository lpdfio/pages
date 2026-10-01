# Section

A `section` is a run of pages inside a document. Each section paginates on its own: its content starts on a new page and continues onto as many pages as it needs. A document can have several sections with different page sizes or orientations.

## Attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `size`        | string  | inherit | Page size override: `letter`, `legal`, `a3`, `a4`, `a5`, or a custom `"200pt 300pt"` |
| `orientation` | string  | inherit | `portrait` or `landscape` |
| `margin`      | spacing | inherit | Page margin: `48pt`, a token such as `l`, or one to four values like `"48pt 24pt"` |
| `background`  | color   | inherit | Page background color |
| `title`       | string  | —       | Section title. Accepted, but not used yet: the PDF has no bookmarks |
| `debug`       | boolean | false   | Render layout boxes for debugging |

All attributes are optional and inherit from `document` when not set.

A section holds a [`layout`](?p=doc/layout), a [`canvas`](?p=doc/canvas), or both. The one listed first is painted first.

## Multiple sections

```xml
<document size="letter" margin="48pt">
  <section>
    <layout>
      <text font-size="14pt">First page</text>
    </layout>
  </section>
  <section>
    <layout>
      <text font-size="14pt">Second page</text>
    </layout>
  </section>
</document>
```

## Mixed page sizes

```xml
<document>
  <section size="letter" margin="48pt">
    <layout>
      <text>Letter page content</text>
    </layout>
  </section>
  <section size="a4" margin="40pt">
    <layout>
      <text>A4 page content</text>
    </layout>
  </section>
</document>
```

## Landscape section

```xml
<section size="letter" orientation="landscape" margin="72pt">
  <layout>
    <text font-size="18pt">Wide page content</text>
  </layout>
</section>
```

## Section titles

A section can carry a `title`. It is accepted and changes nothing in the PDF yet: Lpdf does not write a bookmarks outline, so a long document opens with an empty bookmarks panel.

```xml
<document size="a4" margin="48pt">
  <section title="Introduction">
    <layout>
      <text font-size="20pt">Introduction</text>
    </layout>
  </section>
  <section title="Results">
    <layout>
      <text font-size="20pt">Results</text>
    </layout>
  </section>
</document>
```

Content always goes in a `section`. A `layout` placed directly inside `document` is an error.
