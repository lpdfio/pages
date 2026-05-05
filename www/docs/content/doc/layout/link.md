# Link

Wraps any layout content in a clickable hyperlink. The link is active in PDF viewers that support annotations.

## Attributes

| Attribute | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `href`    | URL    | —       | **Required.** Link destination |
| `gap`     | spacing | —      | Gap between child elements |
| `data-value` | string | —    | Dot-path — replaces `href` with bound value |

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

## Dynamic link from data

```xml
<link data-value="product.url" href="https://example.com">
  <text data-value="product.name" color="#1a73e8">Product</text>
</link>
```
