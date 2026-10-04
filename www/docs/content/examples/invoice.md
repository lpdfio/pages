# Invoice

A two-page invoice filled from JSON: a repeating table, totals, a QR code, and page numbers.

[Open it in the demo](/home?example=invoice) · [document.xml](/docs/examples/invoice/document.xml) · [document.json](/docs/examples/invoice/document.json)

<iframe class="lpdf-example-viewer"
        src="/assets/js/lpdf-demo/viewer/index.html?pdf=/docs/examples/invoice/document.pdf"
        title="The invoice, in the PDF viewer"
        loading="lazy"></iframe>

## What it shows

```text
An invoice whose values come from data: the document.json file next to this one. The preview
reads it too, and updates when you save either file. What this adds to the résumé:

  data-value="customer.name"   replaces the text with that value
  data-source="items"          repeats the element once for each item of a list
  data-if="notes"              shows the element only when the value is there
  data-if-not="invoice.paid"   shows the element only when it is not

The text inside an element is what shows without data. Lpdf places each value as it is, so
format numbers and dates in the JSON, or in the code that writes it.

  table    columns sized by fr, a header row that repeats on every page, a row per item
  canvas   drawn at fixed places on the page, here behind the layout: a colored band on every
           page and a logo made of two shapes on the first. Change "paid" to true in the JSON
           and look at the bottom
  barcode  a QR code, here a link to pay online. Its size is set in points
  region   text pinned to the bottom of every page, outside the flow: the invoice number and
           "Page 1 of 2". {page} and {pages} become the page number and the page count
```

## The document

```xml
<lpdf version="1">
  <!--
    An invoice whose values come from data: the document.json file next to this one. The preview
    reads it too, and updates when you save either file. What this adds to the résumé:

      data-value="customer.name"   replaces the text with that value
      data-source="items"          repeats the element once for each item of a list
      data-if="notes"              shows the element only when the value is there
      data-if-not="invoice.paid"   shows the element only when it is not

    The text inside an element is what shows without data. Lpdf places each value as it is, so
    format numbers and dates in the JSON, or in the code that writes it.

      table    columns sized by fr, a header row that repeats on every page, a row per item
      canvas   drawn at fixed places on the page, here behind the layout: a colored band on every
               page and a logo made of two shapes on the first. Change "paid" to true in the JSON
               and look at the bottom
      barcode  a QR code, here a link to pay online. Its size is set in points
      region   text pinned to the bottom of every page, outside the flow: the invoice number and
               "Page 1 of 2". {page} and {pages} become the page number and the page count
  -->
  <!-- two shades of navy: primary for shapes and large type, primary-dark for the table header
       and the total. White on primary is 11 to 1 and on primary-dark 15 to 1, and text-muted
       keeps 4.5 to 1 even on the accent stripe -->
  <tokens>
    <colors>
      <color name="primary"      value="#1f3b63" />
      <color name="primary-dark" value="#14284a" />
      <color name="surface"      value="#ffffff" />
      <color name="accent"       value="#eef2f7" />
      <color name="text-muted"   value="#5b6676" />
      <color name="rule"         value="#d9e0e9" />
    </colors>
  </tokens>

  <document size="letter" margin="48pt">
    <meta title="Invoice" subject="Invoice" author="Brightwork Studio" />
    <section background="surface">

      <!-- behind the layout, so it is written first. Coordinates are in points from the top left
           of the page, not of the margin, and each shape is one line -->
      <canvas>
        <layer page="each">
          <rect anchor="top-left" w="612pt" h="12pt" fill="primary" />
          <rect anchor="bottom-left" w="612pt" h="6pt" fill="primary" />
        </layer>
        <layer page="first">
          <rect x="48pt" y="40pt" w="30pt" h="30pt" radius="8pt" fill="primary" />
          <circle cx="63pt" cy="55pt" r="7pt" fill="surface" />
        </layer>
      </canvas>

      <layout>
        <stack gap="l"  justify="between">

          <stack gap="l">

            <!-- header: the seller beside the logo, and the invoice number -->
            <flank end="true" gap="m" align="start">
              <stack gap="xs" padding="0pt 0pt 0pt 42pt">
                <text font-size="xl" bold="true" color="primary" data-value="seller.name">Brightwork Studio</text>
                <text font-size="s" color="text-muted" data-value="seller.street">412 Harbor Street, Suite 3</text>
                <text font-size="s" color="text-muted" data-value="seller.city">Portland, ME 04101</text>
                <text font-size="s" color="text-muted" data-value="seller.email">billing@brightwork.example</text>
              </stack>
              <stack gap="xs" align="end">
                <text font-size="xxl" bold="true" color="primary">INVOICE</text>
                <text font-size="s" color="text-muted" data-value="invoice.number">INV-1042</text>
              </stack>
            </flank>

            <divider color="rule" thickness="xs" />

            <!-- who pays it, and when -->
            <split gap="l" align="start">
              <stack gap="xs">
                <text font-size="s" bold="true" color="text-muted">BILL TO</text>
                <text bold="true" data-value="customer.name">Harbor &amp; Pine Co.</text>
                <text font-size="s" color="text-muted" data-value="customer.street">88 Market Square</text>
                <text font-size="s" color="text-muted" data-value="customer.city">Burlington, VT 05401</text>
                <text font-size="s" color="text-muted" data-value="customer.email">accounts@harborpine.example</text>
              </stack>
              <stack gap="xs" align="end">
                <flank end="true" gap="m" align="center">
                  <text font-size="s" color="text-muted">Issue date</text>
                  <text font-size="s" data-value="invoice.issued">March 1, 2027</text>
                </flank>
                <flank end="true" gap="m" align="center">
                  <text font-size="s" color="text-muted">Due date</text>
                  <text font-size="s" bold="true" data-value="invoice.due">March 31, 2027</text>
                </flank>
                <flank end="true" gap="m" align="center">
                  <text font-size="s" color="text-muted">Payment terms</text>
                  <text font-size="s" data-value="invoice.terms">Net 30</text>
                </flank>
              </stack>
            </split>

            <!-- the line items: the header row stays as written, the row repeats for each item.
                 Padding goes on the cells (td); on the table it would pad the whole table -->
            <table cols="5fr 1fr 2fr 2fr" stripe="accent">
              <thead background="primary-dark">
                <td padding="s"><text font-size="s" bold="true" color="surface">Description</text></td>
                <td padding="s"><text font-size="s" bold="true" color="surface" align="right">Qty</text></td>
                <td padding="s"><text font-size="s" bold="true" color="surface" align="right">Unit price</text></td>
                <td padding="s"><text font-size="s" bold="true" color="surface" align="right">Amount</text></td>
              </thead>
              <tr data-source="items">
                <td padding="s">
                  <stack gap="xs">
                    <text data-value="description">Brand identity package</text>
                    <text font-size="s" color="text-muted" data-value="detail">Logo, color palette, type system</text>
                  </stack>
                </td>
                <td padding="s"><text align="right" data-value="quantity">1</text></td>
                <td padding="s"><text align="right" data-value="unitPrice">$3,200.00</text></td>
                <td padding="s"><text align="right" bold="true" data-value="amount">$3,200.00</text></td>
              </tr>
            </table>

            <!-- totals, at the right edge -->
            <cluster justify="end">
              <stack gap="xs" width="220pt">
                <flank end="true" gap="m" align="center">
                  <text font-size="s" color="text-muted">Subtotal</text>
                  <text font-size="s" align="right" data-value="subtotal">$9,130.00</text>
                </flank>
                <flank end="true" gap="m" align="center">
                  <text font-size="s" color="text-muted" data-value="tax.label">Sales tax (8%)</text>
                  <text font-size="s" align="right" data-value="tax.amount">$730.40</text>
                </flank>
                <divider color="rule" thickness="xs" />
                <flank end="true" gap="m" align="center">
                  <text font-size="l" bold="true">Total due</text>
                  <text font-size="l" bold="true" color="primary-dark" align="right" data-value="total">$9,860.40</text>
                </flank>
              </stack>
            </cluster>

          </stack>

          <!-- the foot of the page: how to pay, and one of two notes depending on "paid" -->
          <stack gap="m">
            <divider color="rule" thickness="xs" />
            <!-- how to pay, with a QR code at the right edge: the first child of a flank with end="true"
                 fills the row and the others keep their size. The code is the same on every invoice,
                 because data-value changes text and nothing else, so it cannot carry the number -->
            <flank end="true" gap="m" align="center">
              <stack gap="xs">
                <text font-size="s" bold="true">Payment instructions</text>
                <text font-size="s" color="text-muted" data-value="payment">ACH to Casco Federal Credit Union, routing 011000015, account 4400198273, reference INV-1042</text>
                <text font-size="s" color="text-muted">Or scan the code to pay by card.</text>
              </stack>
              <barcode type="qr" data="https://pay.brightwork.example" size="64pt" color="primary-dark" background="surface" />
            </flank>

            <frame data-if="invoice.paid" background="accent" padding="s" radius="s">
              <text bold="true" color="primary-dark" align="center">Paid in full. Thank you.</text>
            </frame>
            <frame data-if-not="invoice.paid" background="accent" padding="s" radius="s">
              <text color="primary-dark" align="center">Not yet paid. See the due date above.</text>
            </frame>

            <text font-size="s" color="text-muted" data-if="notes" data-value="notes">Thank you for your business.</text>
          </stack>

        </stack>

        <!-- the footer: every page. It is last in the layout, so it is the footer. {page} and {pages}
             become the page number and the page count -->
        <region pin="bottom" page="each">
          <stack gap="xs">
            <divider color="rule" thickness="xs" />
            <flank end="true" align="center">
              <text font-size="s" color="text-muted" data-value="invoice.number">INV-1042</text>
              <text font-size="s" color="text-muted" align="right">Page {page} of {pages}</text>
            </flank>
          </stack>
        </region>

      </layout>
    </section>
  </document>
</lpdf>
```

## The data

```json
{
  "seller": {
    "name": "Brightwork Studio",
    "street": "412 Harbor Street, Suite 3",
    "city": "Portland, ME 04101",
    "email": "billing@brightwork.example"
  },
  "customer": {
    "name": "Harbor & Pine Co.",
    "street": "88 Market Square",
    "city": "Burlington, VT 05401",
    "email": "accounts@harborpine.example"
  },
  "invoice": {
    "number": "INV-1042",
    "issued": "March 1, 2027",
    "due": "March 31, 2027",
    "terms": "Net 30",
    "paid": false
  },
  "items": [
    {
      "description": "Brand identity package",
      "detail": "Logo, color palette, type system",
      "quantity": "1",
      "unitPrice": "$3,200.00",
      "amount": "$3,200.00"
    },
    {
      "description": "Brand guidelines",
      "detail": "Twenty-four page usage manual",
      "quantity": "1",
      "unitPrice": "$1,400.00",
      "amount": "$1,400.00"
    },
    {
      "description": "Stationery design",
      "detail": "Letterhead, business card, envelope",
      "quantity": "1",
      "unitPrice": "$850.00",
      "amount": "$850.00"
    },
    {
      "description": "Website discovery",
      "detail": "Workshops, sitemap, content audit",
      "quantity": "1",
      "unitPrice": "$1,800.00",
      "amount": "$1,800.00"
    },
    {
      "description": "Website design",
      "detail": "Five page templates, desktop and mobile",
      "quantity": "1",
      "unitPrice": "$4,500.00",
      "amount": "$4,500.00"
    },
    {
      "description": "Website build",
      "detail": "Responsive front end, content-managed",
      "quantity": "1",
      "unitPrice": "$5,200.00",
      "amount": "$5,200.00"
    },
    {
      "description": "Content migration",
      "detail": "Per page, existing copy moved and formatted",
      "quantity": "40",
      "unitPrice": "$35.00",
      "amount": "$1,400.00"
    },
    {
      "description": "Copywriting",
      "detail": "Hourly, billed as delivered",
      "quantity": "24",
      "unitPrice": "$95.00",
      "amount": "$2,280.00"
    },
    {
      "description": "Photography direction",
      "detail": "Half-day shoot, twelve edited images",
      "quantity": "1",
      "unitPrice": "$1,200.00",
      "amount": "$1,200.00"
    },
    {
      "description": "Icon set",
      "detail": "Custom icons, delivered as SVG",
      "quantity": "24",
      "unitPrice": "$45.00",
      "amount": "$1,080.00"
    },
    {
      "description": "Social media templates",
      "detail": "Six layouts in two formats",
      "quantity": "6",
      "unitPrice": "$120.00",
      "amount": "$720.00"
    },
    {
      "description": "SEO setup",
      "detail": "Metadata, sitemap, redirects",
      "quantity": "1",
      "unitPrice": "$650.00",
      "amount": "$650.00"
    },
    {
      "description": "Analytics setup",
      "detail": "Tracking, goals, monthly report template",
      "quantity": "1",
      "unitPrice": "$400.00",
      "amount": "$400.00"
    },
    {
      "description": "Accessibility review",
      "detail": "WCAG AA audit and fixes",
      "quantity": "1",
      "unitPrice": "$900.00",
      "amount": "$900.00"
    },
    {
      "description": "Staff training",
      "detail": "Two sessions, recorded",
      "quantity": "2",
      "unitPrice": "$150.00",
      "amount": "$300.00"
    },
    {
      "description": "Project management",
      "detail": "Hourly, across all work above",
      "quantity": "18",
      "unitPrice": "$85.00",
      "amount": "$1,530.00"
    },
    {
      "description": "Domain and SSL setup",
      "detail": "Registration, certificates, DNS",
      "quantity": "1",
      "unitPrice": "$120.00",
      "amount": "$120.00"
    },
    {
      "description": "Launch support",
      "detail": "Two weeks of fixes after go-live",
      "quantity": "1",
      "unitPrice": "$600.00",
      "amount": "$600.00"
    },
    {
      "description": "Hosting and maintenance",
      "detail": "Twelve months, monthly rate",
      "quantity": "12",
      "unitPrice": "$40.00",
      "amount": "$480.00"
    },
    {
      "description": "Priority support",
      "detail": "Twelve months, four hours a month",
      "quantity": "12",
      "unitPrice": "$60.00",
      "amount": "$720.00"
    }
  ],
  "subtotal": "$29,330.00",
  "tax": { "label": "Sales tax (8%)", "amount": "$2,346.40" },
  "total": "$31,676.40",
  "payment": "ACH to Casco Federal Credit Union, routing 011000015, account 4400198273, reference INV-1042",
  "notes": "Thank you for your business. A late fee of 1.5% a month applies after the due date."
}
```
