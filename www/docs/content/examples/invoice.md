# Invoice

A data-driven invoice: header with logo and number, bill-to/ship-to split, line-items table, totals, and a conditional premium badge.

Demonstrates: `flank`, `split`, `table` with `data-source`, `<frame data-if>`, data binding.

```xml
<lpdf version="1">
  <assets>
    <font name="body"    core="Helvetica"/>
    <font name="bold"    core="Helvetica-Bold"/>
  </assets>
  <document size="letter" margin="48pt" font="body">
    <section>
      <layout>
        <stack gap="m">

          <!-- header -->
          <flank align="center">
            <text font="bold" font-size="xxl">Invoice</text>
            <stack gap="xs" align="end">
              <text data-value="invoice_number" align="right">INV-2026-001</text>
              <text data-value="date" align="right" color="#888888">2026-05-04</text>
            </stack>
          </flank>

          <divider/>

          <!-- billing addresses -->
          <split gap="xl">
            <stack gap="xs">
              <text font-size="xs" color="#888888">BILL TO</text>
              <text font="bold" data-value="bill_to.name">Acme Inc</text>
              <text data-value="bill_to.address">123 Main St</text>
              <text data-value="bill_to.city">New York, NY 10001</text>
            </stack>
            <stack gap="xs" align="end">
              <text font-size="xs" color="#888888">SHIP TO</text>
              <text font="bold" data-value="ship_to.name">Acme Inc</text>
              <text data-value="ship_to.address">456 Depot Ave</text>
              <text data-value="ship_to.city">New York, NY 10002</text>
            </stack>
          </split>

          <!-- line items -->
          <table cols="3fr 1fr 1fr 1fr" border="xs #e0e0e0"
                 stripe="#f9f9f9" padding="xs">
            <thead background="#f0f0f0">
              <td><text font="bold" font-size="xs">Description</text></td>
              <td align="end"><text font="bold" font-size="xs">Qty</text></td>
              <td align="end"><text font="bold" font-size="xs">Unit</text></td>
              <td align="end"><text font="bold" font-size="xs">Amount</text></td>
            </thead>
            <tr data-source="items">
              <td><text data-value="description">Consulting</text></td>
              <td align="end"><text data-value="qty">1</text></td>
              <td align="end"><text data-value="unit_price">$1,200.00</text></td>
              <td align="end"><text data-value="amount">$1,200.00</text></td>
            </tr>
          </table>

          <!-- totals -->
          <stack align="end" gap="xs">
            <flank width="200pt">
              <text color="#666666">Subtotal</text>
              <text data-value="subtotal" align="right">$1,600.00</text>
            </flank>
            <flank width="200pt">
              <text color="#666666">Tax (10%)</text>
              <text data-value="tax" align="right">$160.00</text>
            </flank>
            <divider color="#333333" thickness="xs"/>
            <flank width="200pt">
              <text font="bold">Total</text>
              <text font="bold" data-value="total" align="right">$1,760.00</text>
            </flank>
          </stack>

          <!-- conditional badge -->
          <frame data-if="customer.isPremium"
                 padding="xs" background="#fff8e1"
                 border="xs #f9a825" radius="s">
            <text align="center" font-size="xs">★ Premium Customer — Net 60 terms apply</text>
          </frame>

        </stack>
      </layout>

      <!-- page footer -->
      <canvas>
        <layer page="each">
          <line x1="48pt" y1="744pt" x2="564pt" y2="744pt"
                stroke="#e0e0e0" stroke-width="0.5pt"/>
          <text anchor="bottom-center" y="-12pt"
                font-size="8pt" color="#aaaaaa" align="center">
            Thank you for your business
          </text>
        </layer>
      </canvas>
    </section>
  </document>
</lpdf>
```

## Sample data

```json
{
  "invoice_number": "INV-2026-001",
  "date": "2026-05-04",
  "bill_to": {
    "name": "Acme Inc",
    "address": "123 Main St",
    "city": "New York, NY 10001"
  },
  "ship_to": {
    "name": "Acme Inc",
    "address": "456 Depot Ave",
    "city": "New York, NY 10002"
  },
  "items": [
    { "description": "Consulting Services", "qty": "8",  "unit_price": "$150.00", "amount": "$1,200.00" },
    { "description": "Support Retainer",    "qty": "1",  "unit_price": "$400.00", "amount": "$400.00"   }
  ],
  "subtotal": "$1,600.00",
  "tax":      "$160.00",
  "total":    "$1,760.00",
  "customer": { "isPremium": true }
}
```
