import static io.lpdf.L.NoAttr;

import io.lpdf.ColumnAttr;
import io.lpdf.DividerAttr;
import io.lpdf.DocumentAssets;
import io.lpdf.DocumentAttr;
import io.lpdf.DocumentMeta;
import io.lpdf.EngineOptions;
import io.lpdf.ExtractInvoiceDataOptions;
import io.lpdf.FontAttr;
import io.lpdf.GeneratePdfOptions;
import io.lpdf.ImageAttr;
import io.lpdf.ImgAttr;
import io.lpdf.InvoiceFormat;
import io.lpdf.L;
import io.lpdf.LCrossIndustryInvoice;
import io.lpdf.LayoutAttr;
import io.lpdf.Node;
import io.lpdf.RowAttr;
import io.lpdf.TableAttr;
import io.lpdf.TdAttr;
import io.lpdf.TextAttr;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class MakeInvoiceCode {
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws IOException {
        // The invoice's XML, as your accounting software wrote it. Any file name works.
        byte[] invoiceXml = Files.readAllBytes(Path.of("in/invoice-2026-0412.xml"));

        // How values are written on the page: the language's own formatters, and the words for the codes.
        var dateFormat = DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.UK);
        var amountFormat = NumberFormat.getNumberInstance(Locale.UK);
        amountFormat.setMinimumFractionDigits(2);
        Map<String, Map<String, String>> codeNames = Map.of(
            "typeCode", Map.of("380", "Invoice", "381", "Credit note"),
            "lines.unit", Map.of("H87", "pcs", "KGM", "kg"));
        var format = new InvoiceFormat()
            .date((value, entryName) -> LocalDate.parse(value).format(dateFormat))
            .amount((value, entryName) -> amountFormat.format(new BigDecimal(value)))
            .code((value, entryName) -> codeNames.getOrDefault(entryName, Map.of()).getOrDefault(value, value));

        // The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
        var invoice = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, new ExtractInvoiceDataOptions().format(format));
        var note = "Payable within 30 days, by bank transfer.";
        var seller = (Map<String, Object>) invoice.get("seller");
        var buyer = (Map<String, Object>) invoice.get("buyer");
        var totals = (Map<String, Object>) invoice.get("totals");
        var paymentTerms = (List<Map<String, Object>>) invoice.get("paymentTerms");
        var lines = (List<Map<String, Object>>) invoice.get("lines");
        var taxes = (List<Map<String, Object>>) invoice.get("taxes");

        // Attributes used more than once.
        var muted = new TextAttr().fontSize("9pt").color("#5b6475");
        var mutedRight = new TextAttr().fontSize("9pt").color("#5b6475").align("right");
        var right = new TextAttr().align("right");
        var title = new TextAttr().fontSize("20pt").color("#0f4c5c");
        var total = new TextAttr().fontSize("14pt");
        var cell = new TdAttr().padding("xs 0");
        var endRow = new RowAttr().gap("xs").justify("end");

        var doc = L.document(
            new DocumentAttr()
                .size("a4")
                .font("body")
                .assets(new DocumentAssets()
                    .fonts(List.of(new FontAttr().name("body").src("fonts/SourceSans3-Regular.otf")))
                    .images(List.of(new ImageAttr().name("logo").src("logo.png"))))
                .meta(new DocumentMeta().title("Invoice").author("Northwind Paper SAS").lang("en")),
            List.of(
                L.section(NoAttr, List.of(
                    L.layout(new LayoutAttr().margin("48pt"), List.of(
                        L.column(new ColumnAttr().gap("l"), nodes(
                            L.row(new RowAttr().align("center"), List.of(
                                L.column(new ColumnAttr().width("fill"), List.of(L.img(new ImgAttr().name("logo").width("130pt")))),
                                L.row(new RowAttr().gap("xs"), List.of(L.text(title, List.of(invoice.get("typeCode"))), L.text(title, List.of(invoice.get("number")))))
                            )),
                            L.divider(new DividerAttr().color("#dde3ed").thickness("0.5pt")),
                            L.row(new RowAttr().gap("l"), List.of(
                                L.column(new ColumnAttr().width("fill").gap("xs"), List.of(
                                    L.text(muted, List.of("From")),
                                    L.text(NoAttr, List.of(seller.get("name"))),
                                    L.text(NoAttr, List.of(seller.get("street"))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(NoAttr, List.of(seller.get("postcode"))), L.text(NoAttr, List.of(seller.get("city"))))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(NoAttr, List.of("VAT")), L.text(NoAttr, List.of(seller.get("vatId")))))
                                )),
                                L.column(new ColumnAttr().width("fill").gap("xs"), List.of(
                                    L.text(muted, List.of("Billed to")),
                                    L.text(NoAttr, List.of(buyer.get("name"))),
                                    L.text(NoAttr, List.of(buyer.get("street"))),
                                    L.row(new RowAttr().gap("xs"), List.of(L.text(NoAttr, List.of(buyer.get("postcode"))), L.text(NoAttr, List.of(buyer.get("city")))))
                                )),
                                L.column(new ColumnAttr().width("fill").gap("xs"), nodes(
                                    L.text(muted, List.of("Issued · Due")),
                                    L.text(NoAttr, List.of(invoice.get("issued"))),
                                    // A list is a map over a list: one line for each payment term.
                                    paymentTerms.stream().map(term -> L.text(NoAttr, List.of(term.get("due")))).toList()
                                ))
                            )),
                            L.table(new TableAttr().cols("4fr 1fr 1fr 1fr 1fr 1fr").headBorder("xs line").rowBorder("xs line-muted"), nodes(
                                L.thead(NoAttr, List.of(
                                    L.td(cell, List.of(L.text(muted, List.of("Item")))),
                                    L.td(cell, List.of(L.text(mutedRight, List.of("Qty")))),
                                    L.td(cell, List.of(L.text(mutedRight, List.of("Unit")))),
                                    L.td(cell, List.of(L.text(mutedRight, List.of("Price")))),
                                    L.td(cell, List.of(L.text(mutedRight, List.of("VAT %")))),
                                    L.td(cell, List.of(L.text(mutedRight, List.of("Amount"))))
                                )),
                                lines.stream().map(line -> L.tr(NoAttr, List.of(
                                    L.td(cell, List.of(L.text(NoAttr, List.of(line.get("name"))))),
                                    L.td(cell, List.of(L.text(right, List.of(line.get("quantity"))))),
                                    L.td(cell, List.of(L.text(right, List.of(line.get("unit"))))),
                                    L.td(cell, List.of(L.text(right, List.of(line.get("unitPrice"))))),
                                    L.td(cell, List.of(L.text(right, List.of(line.get("vatRate"))))),
                                    L.td(cell, List.of(L.text(right, List.of(line.get("net")))))
                                ))).toList()
                            )),
                            L.row(new RowAttr().justify("end"), List.of(
                                L.column(new ColumnAttr().width("220pt").gap("s"), List.of(
                                    L.table(new TableAttr().cols("1fr 1fr 1fr"), nodes(
                                        L.thead(NoAttr, List.of(
                                            L.td(NoAttr, List.of(L.text(muted, List.of("VAT %")))),
                                            L.td(NoAttr, List.of(L.text(mutedRight, List.of("Basis")))),
                                            L.td(NoAttr, List.of(L.text(mutedRight, List.of("VAT"))))
                                        )),
                                        taxes.stream().map(tax -> L.tr(NoAttr, List.of(
                                            L.td(NoAttr, List.of(L.text(NoAttr, List.of(tax.get("rate"))))),
                                            L.td(NoAttr, List.of(L.text(right, List.of(tax.get("basis"))))),
                                            L.td(NoAttr, List.of(L.text(right, List.of(tax.get("amount")))))
                                        ))).toList()
                                    )),
                                    L.divider(new DividerAttr().color("#dde3ed").thickness("0.5pt")),
                                    L.column(new ColumnAttr().gap("xs"), nodes(
                                        L.row(endRow, List.of(L.text(NoAttr, List.of("VAT")), L.text(NoAttr, List.of(totals.get("vat"))), L.text(NoAttr, List.of(totals.get("currency"))))),
                                        // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                                        totals.containsKey("vatInTaxCurrency") ? List.of(L.row(endRow, List.of(
                                            L.text(muted, List.of("VAT in")),
                                            L.text(muted, List.of(totals.get("taxCurrency"))),
                                            L.text(muted, List.of(totals.get("vatInTaxCurrency")))
                                        ))) : List.of(),
                                        L.row(endRow, List.of(L.text(total, List.of("Total")), L.text(total, List.of(totals.get("gross"))), L.text(total, List.of(totals.get("currency")))))
                                    ))
                                ))
                            )),
                            note.isEmpty() ? List.of() : List.of(L.text(muted, List.of(note)))
                        ))
                    ))
                ))
            ));

        // Java reads the document's font and image files, each a `src`, only through the engine.
        var engine = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))));

        // Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
        byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, doc,
            new GeneratePdfOptions().invoiceXml(invoiceXml).createdOn(Instant.now().toString()));

        Files.write(Path.of("invoice-2026-0412-code.pdf"), pdf);
    }

    // The children of a node from single nodes and lists of nodes together, as the spread `...list` does in JavaScript.
    private static List<Node> nodes(Object... parts) {
        var children = new ArrayList<Node>();
        for (var part : parts) {
            if (part instanceof Collection<?> many) {
                many.forEach(one -> children.add((Node) one));
            } else {
                children.add((Node) part);
            }
        }
        return children;
    }
}
