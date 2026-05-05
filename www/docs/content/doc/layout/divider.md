# Divider

A horizontal or vertical rule.

## Attributes

| Attribute   | Type    | Default      | Description |
|-------------|---------|--------------|-------------|
| `direction` | string  | `horizontal` | `horizontal` or `vertical` |
| `color`     | color   | `#cccccc`    | Line color |
| `thickness` | token/pt | `xs`        | Line thickness: `xs` `s` `m` or `1pt` |

## Horizontal rule

```xml
<stack gap="16pt">
  <text font-size="18pt">Section heading</text>
  <divider/>
  <text>Body text below the rule.</text>
</stack>
```

## Styled divider

```xml
<divider color="#1a73e8" thickness="s"/>
```

## Vertical divider inside a flank

```xml
<flank align="center" gap="16pt">
  <text>Left</text>
  <divider direction="vertical"/>
  <text>Right</text>
</flank>
```
