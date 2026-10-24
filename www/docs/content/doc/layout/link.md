# Link

Wraps any layout content in a clickable hyperlink. The link is active in PDF viewers that support annotations.

## Attributes

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `href`    | URL    | —       | **Required.** Link destination: a URL, or `#id` to jump to the [bookmark](?p=doc/layout/bookmark) with that id |
| `data-href` | string | — | Dot-path: sets `href` from the data. See [Attributes from data](?p=data/binding#attributes-from-data) |
| `gap`     | spacing | —      | Gap between child elements |

## Text link

```xml
<link href="https://lpdf.io">
  <text color="#1a73e8" font-size="m">Visit lpdf.io</text>
</link>
```

## Image link

```xml
<link href="https://lpdf.io">
  <img name="logo" width="80pt"/>
</link>
```

## Link to a bookmark

`#` and a bookmark's id jump to that bookmark, in the same PDF.

```xml
<column gap="m">
  <link href="#terms">
    <text color="#1a73e8">Read the terms</text>
  </link>
  <bookmark label="Terms" id="terms"/>
  <text font-size="l">Terms</text>
</column>
```

A link to an id that no bookmark has is left out of the PDF: its content is drawn, but it is not clickable. In a [table of contents](?p=doc/toc#links-to-entries), `href="#"` alone jumps to the bookmark of the entry it is in.

## Data binding

`data-href` sets the destination from the data, and `href` is what stays when no data is passed or the path has no value. Text inside the link can be bound too. See [Attributes from data](?p=data/binding#attributes-from-data).

```xml
<link href="https://example.com" data-href="product.url">
  <text data-value="product.name" color="#1a73e8">Product</text>
</link>
```

`data-value` does not change `href`.
