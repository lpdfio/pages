from datetime import UTC, date, datetime
from decimal import Decimal
from pathlib import Path

from lpdf import InvoiceFormat, L, LCrossIndustryInvoice

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

pdf = LCrossIndustryInvoice.generate_pdf(
    L.engine(),
    Path("invoice-template.xml").read_text(encoding="utf-8"),
    invoice_xml=invoice_xml,
    format=invoice_format,
    data={"note": "Payable within 30 days, by bank transfer."},
    created_on=datetime.now(UTC).isoformat(),
)

Path("invoice-2026-0412.pdf").write_bytes(pdf)
