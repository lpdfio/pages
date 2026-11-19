#:package Lpdfio.Lpdf@0.36.0
#:property PublishAot=false

using System.Globalization;
using System.Text.Json.Nodes;
using Lpdf;
using Lpdf.Engine;
using Lpdf.Layout;
using static Lpdf.L;

// The invoice's XML, as your accounting software wrote it. Any file name works.
var invoiceXml = File.ReadAllBytes("in/invoice-2026-0412.xml");

// How values are written on the page: the language's own formatters, and the words for the codes.
var british = CultureInfo.GetCultureInfo("en-GB");
var codeNames = new Dictionary<string, Dictionary<string, string>>
{
    ["typeCode"] = new() { ["380"] = "Invoice", ["381"] = "Credit note" },
    ["lines.unit"] = new() { ["H87"] = "pcs", ["KGM"] = "kg" },
};
var format = new InvoiceFormat
{
    Date = (value, _) => DateOnly.Parse(value, CultureInfo.InvariantCulture).ToString("d MMMM yyyy", british),
    Amount = (value, _) => decimal.Parse(value, CultureInfo.InvariantCulture).ToString("N2", british),
    Code = (value, entryName) => codeNames.GetValueOrDefault(entryName)?.GetValueOrDefault(value) ?? value,
};

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
var invoice = LCrossIndustryInvoice.ExtractInvoiceData(invoiceXml, new() { Format = format });
var note = "Payable within 30 days, by bank transfer.";
var seller = invoice["seller"];
var buyer = invoice["buyer"];
var totals = invoice["totals"];

// A value is text, a group an object, a list an array. One the invoice lacks is "", or an empty list.
string Value(JsonNode? group, string name) => group?[name]?.GetValue<string>() ?? "";
IEnumerable<JsonNode?> Items(JsonNode? group, string name) => group?[name]?.AsArray() ?? [];

// Attributes used more than once.
var muted = new TextAttr { FontSize = "9pt", Color = "#5b6475" };
var mutedRight = new TextAttr { FontSize = "9pt", Color = "#5b6475", Align = "right" };
var right = new TextAttr { Align = "right" };
var title = new TextAttr { FontSize = "20pt", Color = "#0f4c5c" };
var total = new TextAttr { FontSize = "14pt" };
var cell = new TdAttr { Padding = "xs 0" };
var endRow = new RowAttr { Gap = "xs", Justify = "end" };

var doc = L.Document(new()
{
    Size = "a4",
    Font = "body",
    Assets = new(
        Fonts: [new() { Name = "body", Src = "fonts/SourceSans3-Regular.otf" }],
        Images: [new() { Name = "logo", Src = "logo.png" }]),
    Meta = new(Title: "Invoice", Author: "Northwind Paper SAS", Lang: "en"),
}, [
    L.Section(NoAttr, [
        L.Layout(new() { Margin = "48pt" }, [
            L.Column(new() { Gap = "l" }, [
                L.Row(new() { Align = "center" }, [
                    L.Column(new() { Width = "fill" }, [L.Img(new() { Name = "logo", Width = "130pt" })]),
                    L.Row(new() { Gap = "xs" }, [L.Text(title, [Value(invoice, "typeCode")]), L.Text(title, [Value(invoice, "number")])]),
                ]),
                L.Divider(new() { Color = "#dde3ed", Thickness = "0.5pt" }),
                L.Row(new() { Gap = "l" }, [
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Text(muted, ["From"]),
                        L.Text(NoAttr, [Value(seller, "name")]),
                        L.Text(NoAttr, [Value(seller, "street")]),
                        L.Row(new() { Gap = "xs" }, [L.Text(NoAttr, [Value(seller, "postcode")]), L.Text(NoAttr, [Value(seller, "city")])]),
                        L.Row(new() { Gap = "xs" }, [L.Text(NoAttr, ["VAT"]), L.Text(NoAttr, [Value(seller, "vatId")])]),
                    ]),
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Text(muted, ["Billed to"]),
                        L.Text(NoAttr, [Value(buyer, "name")]),
                        L.Text(NoAttr, [Value(buyer, "street")]),
                        L.Row(new() { Gap = "xs" }, [L.Text(NoAttr, [Value(buyer, "postcode")]), L.Text(NoAttr, [Value(buyer, "city")])]),
                    ]),
                    L.Column(new() { Width = "fill", Gap = "xs" }, [
                        L.Text(muted, ["Issued · Due"]),
                        L.Text(NoAttr, [Value(invoice, "issued")]),
                        // A list is a Select over an array: one line for each payment term.
                        .. Items(invoice, "paymentTerms").Select(term => L.Text(NoAttr, [Value(term, "due")])),
                    ]),
                ]),
                L.Table(new() { Cols = "4fr 1fr 1fr 1fr 1fr 1fr", HeadBorder = "xs line", RowBorder = "xs line-muted" }, [
                    L.Thead(NoAttr, [
                        L.Td(cell, [L.Text(muted, ["Item"])]),
                        L.Td(cell, [L.Text(mutedRight, ["Qty"])]),
                        L.Td(cell, [L.Text(mutedRight, ["Unit"])]),
                        L.Td(cell, [L.Text(mutedRight, ["Price"])]),
                        L.Td(cell, [L.Text(mutedRight, ["VAT %"])]),
                        L.Td(cell, [L.Text(mutedRight, ["Amount"])]),
                    ]),
                    .. Items(invoice, "lines").Select(line => L.Tr(NoAttr, [
                        L.Td(cell, [L.Text(NoAttr, [Value(line, "name")])]),
                        L.Td(cell, [L.Text(right, [Value(line, "quantity")])]),
                        L.Td(cell, [L.Text(right, [Value(line, "unit")])]),
                        L.Td(cell, [L.Text(right, [Value(line, "unitPrice")])]),
                        L.Td(cell, [L.Text(right, [Value(line, "vatRate")])]),
                        L.Td(cell, [L.Text(right, [Value(line, "net")])]),
                    ])),
                ]),
                L.Row(new() { Justify = "end" }, [
                    L.Column(new() { Width = "220pt", Gap = "s" }, [
                        L.Table(new() { Cols = "1fr 1fr 1fr" }, [
                            L.Thead(NoAttr, [
                                L.Td(NoAttr, [L.Text(muted, ["VAT %"])]),
                                L.Td(NoAttr, [L.Text(mutedRight, ["Basis"])]),
                                L.Td(NoAttr, [L.Text(mutedRight, ["VAT"])]),
                            ]),
                            .. Items(invoice, "taxes").Select(tax => L.Tr(NoAttr, [
                                L.Td(NoAttr, [L.Text(NoAttr, [Value(tax, "rate")])]),
                                L.Td(NoAttr, [L.Text(right, [Value(tax, "basis")])]),
                                L.Td(NoAttr, [L.Text(right, [Value(tax, "amount")])]),
                            ])),
                        ]),
                        L.Divider(new() { Color = "#dde3ed", Thickness = "0.5pt" }),
                        L.Column(new() { Gap = "xs" }, [
                            L.Row(endRow, [L.Text(NoAttr, ["VAT"]), L.Text(NoAttr, [Value(totals, "vat")]), L.Text(NoAttr, [Value(totals, "currency")])]),
                            // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                            .. (Value(totals, "vatInTaxCurrency") != "" ? (Node[])[L.Row(endRow, [
                                L.Text(muted, ["VAT in"]),
                                L.Text(muted, [Value(totals, "taxCurrency")]),
                                L.Text(muted, [Value(totals, "vatInTaxCurrency")]),
                            ])] : []),
                            L.Row(endRow, [L.Text(total, ["Total"]), L.Text(total, [Value(totals, "gross")]), L.Text(total, [Value(totals, "currency")])]),
                        ]),
                    ]),
                ]),
                .. (note != "" ? (Node[])[L.Text(muted, [note])] : []),
            ]),
        ]),
    ]),
]);

// The engine reads the font's and the image's src through SrcFallback, which here reads the file from disk.
using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
var pdf = LCrossIndustryInvoice.GeneratePdf(engine, doc, new() { InvoiceXml = invoiceXml, CreatedOn = DateTimeOffset.Now.ToString("o") });

File.WriteAllBytes("invoice-2026-0412-code.pdf", pdf);
