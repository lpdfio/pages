# Section

A `section` is a full-page container within a document. Each section maps to one or more pages depending on its content height. A document can have multiple sections with different page sizes or orientations.

## Attributes

| Attribute     | Type    | Default | Description |
|---------------|---------|---------|-------------|
| `size`        | string  | inherit | Page size override: `letter`, `a4`, `legal`, `a3` |
| `orientation` | string  | inherit | `portrait` or `landscape` |
| `margin`      | string  | inherit | Page margin, e.g. `48pt` or `1in` |
| `background`  | color   | inherit | Page background color |
| `title`       | string  | —       | Section title in PDF metadata |
| `debug`       | boolean | false   | Render layout boxes for debugging |

All attributes are optional and inherit from `document` when not set.

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
<document font="body">
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

## Single-section shorthand

When you have only one section, `layout` and `canvas` can appear directly inside `document`, omitting the `section` wrapper:

```xml
<document size="letter" margin="48pt">
  <layout>
    <text>Hello world</text>
  </layout>
</document>
```
