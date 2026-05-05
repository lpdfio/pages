# Cluster

Lays out children in a wrapping inline row — like CSS `flex-wrap`. When items don't fit on one line they wrap onto the next.

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `align`      | string  | `start` | Cross-axis alignment: `start` `center` `end` `stretch` |
| `justify`    | string  | `start` | Main-axis distribution: `start` `center` `end` `between` |
| `gap`        | token/pt | —      | Gap between items (horizontal and vertical) |
| `width`      | token/pt | —      | Constrain width |
| `padding`    | spacing | —       | Inner padding |
| `background` | color   | —       | Background color |
| `border`     | string  | —       | Border |
| `radius`     | token/pt | —      | Corner radius |
| `font`       | string  | inherit | Font name |
| `font-size`  | token/pt | inherit | Font size |
| `data-source` | string | —       | Dot-path to array — repeats this element per item |

## Tag / badge row

```xml
<cluster gap="s">
  <frame padding="xs" background="#e8f0fe" radius="xs">
    <text font-size="xs" color="#1a73e8">Design</text>
  </frame>
  <frame padding="xs" background="#e8f0fe" radius="xs">
    <text font-size="xs" color="#1a73e8">Engineering</text>
  </frame>
  <frame padding="xs" background="#fce8e6" radius="xs">
    <text font-size="xs" color="#c5221f">Urgent</text>
  </frame>
</cluster>
```

## Dynamic tags from data

```xml
<cluster gap="xs" data-source="tags">
  <frame padding="xs" background="#f0f0f0" radius="xs">
    <text font-size="xs" data-value="name">Tag</text>
  </frame>
</cluster>
```
