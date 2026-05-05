# Field

Creates an interactive PDF form element. Fields are only active in PDF viewers that support AcroForm (Adobe Acrobat, most desktop viewers).

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** `text` `checkbox` `dropdown` `radio` `button` |
| `name`       | string  | —       | **Required.** Field name in the PDF form |
| `value`      | string  | —       | Default value |
| `label`      | string  | —       | Visible label (for checkbox, radio, button) |
| `options`    | string  | —       | Comma-separated options for `dropdown` |
| `group`      | string  | —       | Radio group name |
| `checked`    | boolean | false   | Initial checked state (checkbox/radio) |
| `required`   | boolean | false   | Mark field as required |
| `readonly`   | boolean | false   | Prevent editing |
| `max-len`    | integer | —       | Maximum text length |
| `action-url` | URL     | —       | Submit URL (button) |
| `width`      | token/pt | —      | Field width |
| `height`     | pt      | —       | Field height |

## Text form

```xml
<stack gap="m">
  <stack gap="xs">
    <text font-size="xs" color="#666666">Full name</text>
    <field type="text" name="full_name" width="xl" height="24pt"/>
  </stack>
  <stack gap="xs">
    <text font-size="xs" color="#666666">Email</text>
    <field type="text" name="email" width="xl" height="24pt"/>
  </stack>
  <field type="button" name="submit" label="Submit" action-url="https://example.com/submit"/>
</stack>
```

## Checkbox

```xml
<flank align="center" gap="s">
  <field type="checkbox" name="agree" value="yes"/>
  <text font-size="s">I agree to the terms and conditions</text>
</flank>
```

## Dropdown

```xml
<field type="dropdown" name="country"
       options="United States,Canada,United Kingdom,Australia"
       width="l" height="24pt"/>
```

## Radio group

```xml
<stack gap="xs">
  <flank align="center" gap="s">
    <field type="radio" name="plan" group="plan" value="basic" checked="true"/>
    <text font-size="s">Basic</text>
  </flank>
  <flank align="center" gap="s">
    <field type="radio" name="plan" group="plan" value="pro"/>
    <text font-size="s">Pro</text>
  </flank>
</stack>
```
