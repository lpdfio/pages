# Field

Creates an interactive PDF form element. Fields are only active in PDF viewers that support AcroForm (Adobe Acrobat, most desktop viewers).

## Attributes

| Attribute    | Type    | Default | Description |
|--------------|---------|---------|-------------|
| `type`       | string  | —       | **Required.** `text` `checkbox` `dropdown` `radio` `button` |
| `name`       | string  | —       | **Required.** Field name in the PDF form |
| `value`      | string  | —       | Default value. A text field and a dropdown draw it in the field (see [Value](#value)) |
| `label`      | string  | —       | Visible label (for checkbox, radio, button) |
| `options`    | string  | —       | Comma-separated options for `dropdown` |
| `group`      | string  | —       | Radio group name |
| `checked`    | boolean | false   | Initial checked state (checkbox/radio) |
| `required`   | boolean | false   | Mark field as required |
| `readonly`   | boolean | false   | Prevent editing |
| `max-len`    | integer | —       | Maximum text length |
| `action-url` | URL     | —       | Submit URL (button) |
| `width`      | token/length | —      | Field width |
| `height`     | token/length | —      | Field height: a length, or a name from the `height` row of [tokens](?p=xml/schema#tokens) |
| `ocg` | string | — | `screen`: shown only on screen. `print` is an error: a field in print content could be filled nowhere. See [Print and screen content](?p=print-and-screen#links-and-form-fields) |

## Font

A field's text is set in the font around it, as a text's is: the `font` of the document, or of a box around the field. With no font set it is Helvetica.

What a user types into a text field is drawn in that font, so the font of a text field that is not `readonly` is written into the PDF whole, not as the subset of glyphs the document uses. That adds at most the size of the font file. A checkbox, a radio button, a dropdown, a push button and a `readonly` field keep the subset with the characters they show.

A [PDF/A](?p=pdfa) file embeds every font, so a form in it needs a font declared in `assets` and set on the document: the fields then take it with nothing more to write. A push button (`type="button"`) is the one kind PDF/A refuses.

## Value

The `value` of a text field and the selected value of a dropdown are drawn in the field itself, so a viewer shows them at once, before the field has focus. The text is black, in the field's font, from the left edge inside the border, and its size fits the field's height: 55% of it, and never under 6pt, so a taller field has larger text. A value longer than the field is cut off at its border. A viewer that lets the user type picks its own size once the field has focus.

## Text form

```xml
<column gap="m">
  <column gap="xs">
    <text font-size="xs" color="#666666">Full name</text>
    <field type="text" name="full_name" width="xl" height="24pt"/>
  </column>
  <column gap="xs">
    <text font-size="xs" color="#666666">Email</text>
    <field type="text" name="email" width="xl" height="24pt"/>
  </column>
  <field type="button" name="submit" label="Submit" action-url="https://example.com/submit"/>
</column>
```

## Checkbox

```xml
<row align="center" gap="s">
  <field type="checkbox" name="agree" value="yes"/>
  <text font-size="s" width="fill">I agree to the terms and conditions</text>
</row>
```

## Dropdown

```xml
<field type="dropdown" name="country"
       options="United States,Canada,United Kingdom,Australia"
       width="l" height="24pt"/>
```

## Radio group

```xml
<column gap="xs">
  <row align="center" gap="s">
    <field type="radio" name="plan" group="plan" value="basic" checked="true"/>
    <text font-size="s" width="fill">Basic</text>
  </row>
  <row align="center" gap="s">
    <field type="radio" name="plan" group="plan" value="pro"/>
    <text font-size="s" width="fill">Pro</text>
  </row>
</column>
```
