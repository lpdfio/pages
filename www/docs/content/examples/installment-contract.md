# Installment contract

A four-page retail installment contract: boxed forms, leader lines and a rotated SAMPLE watermark.

[Open it in the demo](/home?example=installment-contract) · [document.xml](/docs/examples/installment-contract/document.xml)

<iframe class="lpdf-example-viewer"
        src="/assets/js/lpdf-demo/viewer/index.html?pdf=/docs/examples/installment-contract/document.pdf"
        title="The installment contract, in the PDF viewer"
        loading="lazy"></iframe>

## What it shows

```text
A retail installment contract, the kind a dealer signs with a buyer and sells on to a lender: four US Letter
pages, laid out as such forms are. The seller, the buyers, the lender, the vehicle and the figures are invented,
and the terms are written for this demonstration, so it is not a form to use. The boxed headings and the wording
under them in the disclosure statement, and the notice about holders, are the ones federal rules give. What this
adds to the brochure:

  tokens           the size scale is small (xs is 7.5pt, s is 8.5pt, m is 10pt) so a page can hold a form. The size
                   is set once, on the stack that holds a page, and every text inside inherits it
  table            the parties are a table of boxed cells; the five boxes of the disclosure are cells of one row,
                   the first two with a heavier border; the itemization is a table whose rows hold a label, a
                   dollar sign and a box for the amount
  leaders          a label followed by a divider in a flank fills the line, as a row of dots does on paper. The
                   same flank with a label in front of the divider is how a blank to sign is drawn
  typed entries    what is filled in is in a Courier font and a blue, as on a completed form, so the form and
                   what is written on it are told apart
  check boxes      a stack 7pt square with a border, and a background when it is ticked
  paginate         paginate="break-before" on a page's stack starts the page at the top of a new one
  canvas           the watermark, the initials boxes and the page number are on the canvas, with a page range:
                   a region would reserve its space on every page, and these sit in the margins
  transform        transform="rotate(-35 306 396)" on the watermark layer turns it about the middle of the page.
                   The angle is in degrees, anticlockwise when negative; the two numbers after it are the pivot

The figures follow from the itemization: the amount financed is the unpaid balance of the cash price (the cash
price less the total down payment), plus the documentary fee, plus the amounts paid to others. The payment is the
level monthly payment for that amount at the annual percentage rate over the term. The finance charge is the
total of payments less the amount financed, and the total sale price is the total of payments plus the total down
payment.
```

## The document

The document is 1,124 lines, so it is not repeated here. Open it in the demo to read it beside the PDF it makes, or download it above.
