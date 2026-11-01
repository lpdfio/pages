# Print and screen content

Some content belongs on screen and not on paper, or the other way round: a "Pay online" link, a line to cut along and a return slip, a stamp on the printed copy. `ocg` on an element puts it in an optional content group, PDF's own way to show or hide part of a page: `print` content is printed and not shown on screen, and `screen` content is shown on screen and not printed. The viewer switches the groups as it shows or prints the page.

```xml
<layout margin="40pt">
  <text>Invoice 2026-1105 · EUR 1,240.00 due by 30 November</text>
  <text ocg="screen" color="#0047ab">Pay online at example.com/pay, or print this page to pay by transfer.</text>
  <column ocg="print" border="1pt #c00000" padding="12pt" gap="8pt">
    <text>Return slip: send it with your payment</text>
    <row gap="8pt" align="center">
      <text>Amount paid:</text>
      <frame width="120pt" height="20pt" border="0.5pt #c00000"/>
    </row>
  </column>
</layout>
```

## The ocg attribute

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `ocg` | string | — | `print`: the element and everything in it are printed and not shown on screen. `screen`: shown on screen and not printed. Any other value is an error that names it |

It goes on the elements that draw: `column`, `row`, `grid`, `frame`, `list`, `li`, `code`, `link`, `text`, `img`, `barcode`, `shape`, `divider`, `field`, a `table` with its `thead`, `tr` and `td`, a [`layer`](?p=doc/layer), and each element a layer draws. A `region`, a `markdown`, a `section` and the parts of a text (`span`, `code-span`, `fn`) take none: put it on the elements a region holds, or on the text a span is in. A document built in code sets it as it sets any other attribute: `ocg: 'print'` in Node.js and PHP, `Ocg = "print"` in .NET and `ocg="print"` in Python.

## In a group

- Everything in the element is in its group: a box's children, the cells and the background of a table row, what a layer draws.
- Hidden content keeps its room. Nothing moves when a group is hidden, so screen content leaves its gap on paper, and print content its gap on screen.
- An element with a group inside an element with another shows only where both show, which is never: a `screen` link inside a `print` slip is in neither the print nor the screen version.
- Content split across pages, and content repeated on each page, such as an element in a [region](?p=doc/layout#pinned-regions) or the header row of a table, is in its group on every page.

To show one thing on screen and another in the same place on paper, put both in a layer, where nothing takes room:

```xml
<layer>
  <text-at x="40pt" y="16pt" ocg="screen">Viewed on screen</text-at>
  <text-at x="40pt" y="16pt" ocg="print">Printed copy</text-at>
</layer>
```

## Which viewers switch the groups

Both groups start on, and the viewer turns one off as it shows the page, or as it prints it. Acrobat, Chrome and Firefox do: they show the screen content, and print the print content. Preview and Safari on the Mac show everything, on screen and in print, as they would show a document without `ocg`. A viewer with a layers panel, such as Acrobat, lists the two groups as "Print only" and "Screen only", and a reader can turn either on or off by hand.

## Links and form fields

- A link in print content does nothing: its words are drawn and printed, and no link is written, so there is no spot on screen to click where nothing shows. A link in screen content works as any other.
- A form field can't be in print content, where it could be filled neither on screen, which hides it, nor on paper. It is an error, which says to use a [`frame`](?p=doc/layout/frame) with a border for a box filled in by hand, as the slip above does. A field in screen content is filled on screen as any other.

## PDF/A and PDF/UA

With `pdfa` or `pdfua` on the [`output`](?p=xml/elements#output), everything shows: the file is written as if the document had no `ocg`, on screen and in print, and a link in print content is a link. PDF/A and PDF/UA forbid the entry that switches a group between screen and print. A document with `ocg` renders with either without an error, so one template serves both: the [PDF/A](?p=pdfa) copy holds the print content and the screen content alike, and a screen reader reads all of a [PDF/UA](?p=pdfua) file. A form field in print content is an error there too.

## PDF/X

A [PDF/X](?p=pdfx) file goes to a press, which prints what is on by default, and PDF/X-4 has no switching between screen and print. So with `pdfx`, the file is the print version: print content is on, and screen content stays in the file, off. A viewer shows the print version too, as a proof of what the press prints, and a reader can turn "Screen only" on in a layers panel, such as Acrobat's. With `pdfua` as well, everything shows, as in any PDF/UA file.

## Hidden is not removed

Content in a hidden group is still in the file. A reader can select, search and copy it, and a viewer that ignores groups shows it. A group is for presentation, never a way to keep anything secret.
