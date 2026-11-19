import io.lpdf.EngineOptions;
import io.lpdf.GeneratePdfOptions;
import io.lpdf.InvoiceFormat;
import io.lpdf.L;
import io.lpdf.LCrossIndustryInvoice;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;
import java.util.Map;

public class MakeInvoice {
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

        // Java reads the template's font and image files, each a `src`, only through the engine.
        var engine = L.engine(new EngineOptions().srcFallback(src -> Files.readAllBytes(Path.of(src))));

        byte[] pdf = LCrossIndustryInvoice.generatePdf(engine, Files.readString(Path.of("invoice-template.xml")),
            new GeneratePdfOptions()
                .invoiceXml(invoiceXml)
                .format(format)
                .data(Map.of("note", "Payable within 30 days, by bank transfer."))
                .createdOn(Instant.now().toString()));

        Files.write(Path.of("invoice-2026-0412.pdf"), pdf);
    }
}
