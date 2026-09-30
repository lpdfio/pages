# Divider

A horizontal or vertical rule.

## Attributes

| Attribute   | Type    | Default      | Description |
|-------------|---------|--------------|-------------|
| `direction` | string  | `horizontal` | `horizontal` or `vertical` |
| `color`     | color   | `#000000`    | Line color |
| `thickness` | token/pt | `1pt`       | Line thickness: a border token (`xs` 0.5pt, `s` 1pt, `m` 1.5pt, `l` 2pt, `xl` 3pt, `xxl` 4pt) or a length such as `1pt` |

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
