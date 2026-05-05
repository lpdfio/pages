# Data Binding

Data binding lets you separate document structure from content. Pass a JSON or XML data object alongside your document XML, then reference values with `data-*` attributes.

## The four attributes

| Attribute     | Where valid | Effect |
|---------------|-------------|--------|
| `data-value`  | Any layout element, canvas `text` and `img` | Replaces the element's text content (or `name`/`href`) with the value at the given dot-path |
| `data-source` | Any layout element | Dot-path to an array — repeats this element once per item; inside the loop, paths are relative to the current item |
| `data-if`     | Any layout element | Renders the element only when the value at the path is truthy |
| `data-if-not` | Any layout element | Renders the element only when the value at the path is falsy |

## Passing data

::: sdk js

```javascript
const pdf = await engine.renderPdf(xml, {
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
$pdf = $engine->renderPdf($xml, [
    'data' => [
        'invoice_number' => 'INV-2026-001',
        'customer' => ['name' => 'Acme Inc', 'address' => '123 Main St'],
        'items' => [
            ['description' => 'Consulting', 'price' => '$1,200.00'],
            ['description' => 'Support',    'price' => '$400.00'],
        ],
        'total' => '$1,600.00',
    ],
]);
```

:::

::: sdk python

```python
pdf = engine.render(xml, data={
    'invoice_number': 'INV-2026-001',
    'customer': {'name': 'Acme Inc', 'address': '123 Main St'},
    'items': [
        {'description': 'Consulting', 'price': '$1,200.00'},
        {'description': 'Support',    'price': '$400.00'},
    ],
    'total': '$1,600.00',
})
```

:::

::: sdk dotnet

```csharp
var data = new {
    invoice_number = "INV-2026-001",
    customer = new { name = "Acme Inc", address = "123 Main St" },
    items = new[] {
        new { description = "Consulting", price = "$1,200.00" },
        new { description = "Support",    price = "$400.00" },
    },
    total = "$1,600.00",
};

var pdf = await engine.Render(xml, data);
```

:::

## `data-value` — inject a scalar

Replaces the element's text content with the value at the dot-path.

```xml
<!-- static -->
<text>INV-2026-001</text>

<!-- data-driven -->
<text data-value="invoice_number">INV-2026-001</text>
```

The literal content (`INV-2026-001`) serves as a fallback placeholder visible in the XML source.

Nested paths use dot notation:

```xml
<text data-value="customer.name">Acme Inc</text>
<text data-value="customer.address">123 Main St</text>
```

## `data-source` — loop over an array

Repeats the element once per item. Inside the loop, `data-value` paths are relative to the current item.

```xml
<stack data-source="items" gap="xs">
  <flank>
    <text data-value="description">Item</text>
    <text data-value="price" align="right">$0.00</text>
  </flank>
</stack>
```

Works on any layout element — `stack`, `tr`, `frame`, etc.

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

A value is truthy if it is non-empty, non-zero, and not the string `"false"`.

## Combining attributes

`data-source`, `data-if`, and `data-value` can appear on the same element:

```xml
<!-- loop over items, skip those with zero quantity -->
<tr data-source="items" data-if="qty">
  <td><text data-value="description">Item</text></td>
  <td><text data-value="qty" align="right">0</text></td>
  <td><text data-value="amount" align="right">$0.00</text></td>
</tr>
```

## Dynamic image name

`data-value` on `img` replaces the `name` attribute:

```xml
<assets>
  <image name="logo_acme" src="…"/>
  <image name="logo_globex" src="…"/>
</assets>

<!-- name is replaced by customer.logoAsset at render time -->
<img data-value="customer.logoAsset" name="logo_acme" width="80pt"/>
```
