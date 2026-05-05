# XML Schema

lpdf documents are described in XML. Download the schema: [lpdf.xsd](https://lpdf.io/schema/lpdf.xsd).

## Document structure

```
<lpdf version="1">
  <assets>           ← optional: fonts, images
  <tokens>           ← optional: custom spacing/color tokens
  <document>         ← required
    <section>+       ← one or more pages / page groups
      <layout>       ← flow content
        …primitives
      <canvas>       ← absolute positioned overlays
        <layer>+
          …primitives
```

**Single-section shorthand** — when you have only one section, `layout` can appear directly inside `document`:

```xml
<document size="letter" margin="48pt">
  <layout>
    <text>Hello world</text>
  </layout>
</document>
```

## Page sizes

| Value    | Dimensions        |
|----------|-------------------|
| `letter` | 8.5 × 11 in       |
| `legal`  | 8.5 × 14 in       |
| `a4`     | 210 × 297 mm      |
| `a3`     | 297 × 420 mm      |

Custom: `width="200pt" height="300pt"`.

## Units

| Unit | Meaning             |
|------|---------------------|
| `pt` | PDF points (1/72 in)|
| `in` | Inches              |
| `mm` | Millimetres         |
| `px` | Pixels (96 dpi)     |
| `%`  | Percentage of parent |

Signed pt values (e.g. canvas `x`, `y`) accept negative numbers: `-18pt`.

## Token scale

The built-in spacing/size token scale used by padding, gap, font-size, and similar attributes:

| Token | Approx. pt |
|-------|-----------|
| `xs`  | 4 pt      |
| `s`   | 8 pt      |
| `m`   | 12 pt     |
| `l`   | 18 pt     |
| `xl`  | 24 pt     |
| `xxl` | 36 pt     |

## BorderValue format

Borders accept a string combining an optional thickness and a color:

```
"s #cccccc"       ← token thickness + hex color
"1.5pt #333333"   ← pt thickness + hex color
"#e0e0e0"         ← color only (uses default thickness)
```

## Element reference

See [All Elements](/?p=xml/elements) for a full attribute reference for every element.
