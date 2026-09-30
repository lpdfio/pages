# Data Binding

Data binding lets you separate document structure from content. Pass a data object alongside your document XML, then reference values with `data-*` attributes.

## The four attributes

| Attribute     | Where valid | Effect |
|---------------|-------------|--------|
| `data-value`  | `text` in the layout, including inside a `region` | Replaces the text content with the value at the given dot-path |
| `data-source` | Any layout element | Dot-path to an array — repeats this element once per item; inside the loop, paths are relative to the current item |
| `data-if`     | Any layout element | Renders the element only when the value at the path is truthy |
| `data-if-not` | Any layout element | Renders the element only when the value at the path is falsy |

Data binding applies to the layout and to regions. Canvas elements are not bound: a `data-value` on a canvas `text` or `img`, and on a `link`, `img` or `barcode` in the layout, has no effect.

## Passing data

The data is a plain object (a dictionary in Python, an array or object in PHP, any object in .NET) that the SDK sends to the engine as JSON. It is an option of the `render` call, and it applies only when you render XML.

::: sdk js

```javascript
const pdf = await engine.render(xml, {
    data: {
        invoice_number: 'INV-2026-001',
        customer: { name: 'Acme Inc', address: '123 Main St' },
        items: [
            { description: 'Consulting', price: '$1,200.00' },
            { description: 'Support', price: '$400.00' },
        ],
        total: '$1,600.00',
    },
})
```

:::

::: sdk php

```php
use Lpdf\Engine\RenderOptions;

$pdf = $engine->render($xml, new RenderOptions(data: [
    'invoice_number' => 'INV-2026-001',
    'customer' => ['name' => 'Acme Inc', 'address' => '123 Main St'],
    'items' => [
        ['description' => 'Consulting', 'price' => '$1,200.00'],
        ['description' => 'Support',    'price' => '$400.00'],
    ],
    'total' => '$1,600.00',
]));
```

:::

::: sdk python

```python
from lpdf import RenderOptions

pdf = engine.render(xml, RenderOptions(data={
    'invoice_number': 'INV-2026-001',
    'customer': {'name': 'Acme Inc', 'address': '123 Main St'},
    'items': [
        {'description': 'Consulting', 'price': '$1,200.00'},
        {'description': 'Support',    'price': '$400.00'},
    ],
    'total': '$1,600.00',
}))
```

:::

::: sdk dotnet

```csharp
using Lpdf.Engine;

var data = new {
    invoice_number = "INV-2026-001",
    customer = new { name = "Acme Inc", address = "123 Main St" },
    items = new[] {
        new { description = "Consulting", price = "$1,200.00" },
        new { description = "Support",    price = "$400.00" },
    },
    total = "$1,600.00",
};

var pdf = await engine.Render(xml, new RenderOptions { Data = data });
```

:::

## `data-value` — inject a scalar

Replaces the element's text content with the value at the dot-path. A number or a boolean is written as text. An object, an array, or a path with no value gives empty text.

```xml
<!-- static -->
<text>INV-2026-001</text>

<!-- data-driven -->
<text data-value="invoice_number">INV-2026-001</text>
```

The literal content (`INV-2026-001`) is what renders when you pass no data, and it keeps the XML readable on its own. When you do pass data and the path has no value, the text is empty.

Nested paths use dot notation, and `[n]` picks an array item:

```xml
<text data-value="customer.name">Acme Inc</text>
<text data-value="items[0].description">First item</text>
```

## `data-source` — loop over an array

Repeats the element once per item. Inside the loop, paths are relative to the current item.

```xml
<stack data-source="items" gap="xs">
  <flank>
    <text data-value="description">Item</text>
    <text data-value="price" align="right">$0.00</text>
  </flank>
</stack>
```

Works on any layout element — `stack`, `tr`, `frame`, etc. If the path is missing or is not an array, the element is left out.

Two prefixes reach outside the current item: a path that starts with `/` is read from the root of the data, and each `../` goes up one loop level.

```xml
<stack data-source="items">
  <text data-value="/invoice_number">INV-2026-001</text>
</stack>
```

## `data-if` / `data-if-not` — conditional rendering

```xml
<!-- render only when customer.isPremium is truthy -->
<frame data-if="customer.isPremium" padding="xs" background="#ffd700" radius="xs">
  <text align="center">★ Premium Customer</text>
</frame>

<!-- render only when customer.isPremium is falsy -->
<frame data-if-not="customer.isPremium" padding="xs" background="#f0f0f0" radius="xs">
  <text align="center">Standard Customer</text>
</frame>
```

A value is falsy when it is missing, `null`, `false`, `0`, an empty string, an empty array, or an empty object. Everything else is truthy. That includes the string `"false"`, so pass a real boolean, not a string.

## Combining attributes

`data-if` and `data-if-not` are checked first, then `data-source` repeats the element. Both read their path from outside the loop, so a condition on the looped element cannot look at the current item.

```xml
<!-- loop over items, but only when there are any -->
<tr data-source="items" data-if="items">
  <td><text data-value="description">Item</text></td>
  <td><text data-value="amount" align="right">$0.00</text></td>
</tr>
```

To skip some items, put the condition on an element inside the loop. There it reads from the current item:

```xml
<!-- loop over items, skip those with zero quantity -->
<stack data-source="items" gap="xs">
  <flank data-if="qty">
    <text data-value="description">Item</text>
    <text data-value="qty" align="right">0</text>
  </flank>
</stack>
```
