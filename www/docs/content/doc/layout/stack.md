# Stack

Stacks children vertically with a configurable gap. The default axis is vertical — all children fill the available width.

## Attributes

| Attribute    | Type    | Default  | Description |
|--------------|---------|----------|-------------|
| `gap`        | token/pt | —       | Space between children: `xs` `s` `m` `l` `xl` `xxl` or `12pt` |
| `align`      | string  | `start`  | Cross-axis alignment: `start` `center` `end` `stretch` |
| `justify`    | string  | `start`  | Main-axis distribution: `start` `center` `end` `between` |
| `width`      | token/pt | —       | Constrain width |
| `padding`    | spacing | —        | Inner padding: `16pt` or shorthand `"16pt 12pt"` |
| `background` | color   | —        | Background color |
| `border`     | string  | —        | Border: `"s #cccccc"` or `"1pt #cccccc"` |
| `radius`     | token/pt | —       | Corner radius |
| `height`     | pt/`fill`/`full` | — | Fixed height, fill remaining space, or full page height |
| `font`       | string  | inherit  | Font name (declared in `assets`) |
| `font-size`  | token/pt | inherit | Font size for all children |
| `data-source` | string | —       | Dot-path to array — repeats this element per item |
| `data-if`    | string  | —        | Render only when value is truthy |
| `data-if-not` | string | —       | Render only when value is falsy |

## Basic example

```xml
<stack gap="16pt">
  <text font-size="18pt">Title</text>
  <divider/>
  <text>Body text.</text>
</stack>
```

## Centered content

```xml
<stack gap="12pt" align="center">
  <text>Centered item</text>
  <text>Also centered</text>
</stack>
```

## Space between (like flex justify-content: space-between)

```xml
<stack justify="between" height="full">
  <text>Top</text>
  <text>Bottom</text>
</stack>
```

## Card with background and border

```xml
<stack gap="8pt" padding="m" background="#f8f9fa" border="xs #e0e0e0" radius="s">
  <text font-size="s">Card title</text>
  <text font-size="xs" color="#666666">Supporting text.</text>
</stack>
```
