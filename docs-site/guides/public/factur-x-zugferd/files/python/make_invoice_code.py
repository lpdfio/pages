from datetime import UTC, date, datetime
from decimal import Decimal
from pathlib import Path

from lpdf import (
    ColumnAttr,
    DividerAttr,
    DocumentAssets,
    DocumentAttr,
    DocumentMeta,
    FontAttr,
    ImageAttr,
    ImgAttr,
    InvoiceFormat,
    L,
    LayoutAttr,
    LCrossIndustryInvoice,
    NoAttr,
    RowAttr,
    TableAttr,
    TdAttr,
    TextAttr,
)

# The invoice's XML, as your accounting software wrote it. Any file name works.
invoice_xml = Path("in/invoice-2026-0412.xml").read_bytes()

# How values are written on the page: the language's own formatters, and the words for the codes.
code_names = {
    "typeCode": {"380": "Invoice", "381": "Credit note"},
    "lines.unit": {"H87": "pcs", "KGM": "kg"},
}

invoice_format = InvoiceFormat(
    # The day has no leading zero. The month is in English, unless the program sets a locale.
    date=lambda value, _: "{0.day} {0:%B %Y}".format(date.fromisoformat(value)),
    amount=lambda value, _: f"{Decimal(value):,.2f}",
    code=lambda value, entry_name: code_names.get(entry_name, {}).get(value, value),
)

# The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
invoice = LCrossIndustryInvoice.extract_invoice_data(invoice_xml, format=invoice_format)
note = "Payable within 30 days, by bank transfer."
seller, buyer, totals = invoice["seller"], invoice["buyer"], invoice["totals"]

# Attributes used more than once.
muted = TextAttr(font_size="9pt", color="#5b6475")
muted_right = TextAttr(font_size="9pt", color="#5b6475", align="right")
right = TextAttr(align="right")
title = TextAttr(font_size="20pt", color="#0f4c5c")
total = TextAttr(font_size="14pt")
cell = TdAttr(padding="xs 0")
end_row = RowAttr(gap="xs", justify="end")

doc = L.document(DocumentAttr(
    size="A4",
    font="body",
    assets=DocumentAssets(
        fonts=[FontAttr(name="body", src="fonts/SourceSans3-Regular.otf")],
        images=[ImageAttr(name="logo", src="logo.png")],
    ),
    meta=DocumentMeta(title="Invoice", author="Northwind Paper SAS", lang="en"),
), [
    L.section(NoAttr, [
        L.layout(LayoutAttr(margin="48pt"), [
            L.column(ColumnAttr(gap="l"), [
                L.row(RowAttr(align="center"), [
                    L.column(ColumnAttr(width="fill"), [L.img(ImgAttr(name="logo", width="130pt"))]),
                    L.row(RowAttr(gap="xs"), [
                        L.text(title, [invoice["typeCode"]]),
                        L.text(title, [invoice["number"]]),
                    ]),
                ]),
                L.divider(DividerAttr(color="#dde3ed", thickness="0.5pt")),
                L.row(RowAttr(gap="l"), [
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.text(muted, ["From"]),
                        L.text(NoAttr, [seller["name"]]),
                        L.text(NoAttr, [seller["street"]]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(NoAttr, [seller["postcode"]]),
                            L.text(NoAttr, [seller["city"]]),
                        ]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(NoAttr, ["VAT"]),
                            L.text(NoAttr, [seller["vatId"]]),
                        ]),
                    ]),
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.text(muted, ["Billed to"]),
                        L.text(NoAttr, [buyer["name"]]),
                        L.text(NoAttr, [buyer["street"]]),
                        L.row(RowAttr(gap="xs"), [
                            L.text(NoAttr, [buyer["postcode"]]),
                            L.text(NoAttr, [buyer["city"]]),
                        ]),
                    ]),
                    L.column(ColumnAttr(width="fill", gap="xs"), [
                        L.text(muted, ["Issued · Due"]),
                        L.text(NoAttr, [invoice["issued"]]),
                        # A list is a comprehension: one line for each payment term.
                        *[L.text(NoAttr, [term["due"]]) for term in invoice["paymentTerms"]],
                    ]),
                ]),
                L.table(TableAttr(cols="4fr 1fr 1fr 1fr 1fr 1fr", head_border="xs line", row_border="xs line-muted"), [
                    L.thead(NoAttr, [
                        L.td(cell, [L.text(muted, ["Item"])]),
                        L.td(cell, [L.text(muted_right, ["Qty"])]),
                        L.td(cell, [L.text(muted_right, ["Unit"])]),
                        L.td(cell, [L.text(muted_right, ["Price"])]),
                        L.td(cell, [L.text(muted_right, ["VAT %"])]),
                        L.td(cell, [L.text(muted_right, ["Amount"])]),
                    ]),
                    *[L.tr(NoAttr, [
                        L.td(cell, [L.text(NoAttr, [line["name"]])]),
                        L.td(cell, [L.text(right, [line["quantity"]])]),
                        L.td(cell, [L.text(right, [line["unit"]])]),
                        L.td(cell, [L.text(right, [line["unitPrice"]])]),
                        L.td(cell, [L.text(right, [line["vatRate"]])]),
                        L.td(cell, [L.text(right, [line["net"]])]),
                    ]) for line in invoice["lines"]],
                ]),
                L.row(RowAttr(justify="end"), [
                    L.column(ColumnAttr(width="220pt", gap="s"), [
                        L.table(TableAttr(cols="1fr 1fr 1fr"), [
                            L.thead(NoAttr, [
                                L.td(NoAttr, [L.text(muted, ["VAT %"])]),
                                L.td(NoAttr, [L.text(muted_right, ["Basis"])]),
                                L.td(NoAttr, [L.text(muted_right, ["VAT"])]),
                            ]),
                            *[L.tr(NoAttr, [
                                L.td(NoAttr, [L.text(NoAttr, [tax["rate"]])]),
                                L.td(NoAttr, [L.text(right, [tax["basis"]])]),
                                L.td(NoAttr, [L.text(right, [tax["amount"]])]),
                            ]) for tax in invoice["taxes"]],
                        ]),
                        L.divider(DividerAttr(color="#dde3ed", thickness="0.5pt")),
                        L.column(ColumnAttr(gap="xs"), [
                            L.row(end_row, [
                                L.text(NoAttr, ["VAT"]),
                                L.text(NoAttr, [totals["vat"]]),
                                L.text(NoAttr, [totals["currency"]]),
                            ]),
                            # An optional line is an if: the VAT in the tax currency, when there is one.
                            *([L.row(end_row, [
                                L.text(muted, ["VAT in"]),
                                L.text(muted, [totals["taxCurrency"]]),
                                L.text(muted, [totals["vatInTaxCurrency"]]),
                            ])] if "vatInTaxCurrency" in totals else []),
                            L.row(end_row, [
                                L.text(total, ["Total"]),
                                L.text(total, [totals["gross"]]),
                                L.text(total, [totals["currency"]]),
                            ]),
                        ]),
                    ]),
                ]),
                *([L.text(muted, [note])] if note else []),
            ]),
        ]),
    ]),
])

# Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
pdf = LCrossIndustryInvoice.generate_pdf(
    L.engine(), doc, invoice_xml=invoice_xml, created_on=datetime.now(UTC).isoformat()
)

Path("invoice-2026-0412-code.pdf").write_bytes(pdf)
