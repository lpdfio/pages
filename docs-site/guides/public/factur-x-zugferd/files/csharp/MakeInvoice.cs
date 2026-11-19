#:package Lpdfio.Lpdf@0.36.0
#:property PublishAot=false

using System.Globalization;
using Lpdf;
using Lpdf.Engine;

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

// The engine reads the font's and the image's src through SrcFallback, which here reads the file from disk.
using var engine = L.Engine(new EngineOptions { SrcFallback = File.ReadAllBytes });
var pdf = LCrossIndustryInvoice.GeneratePdf(engine, File.ReadAllText("invoice-template.xml"), new()
{
    InvoiceXml = invoiceXml,
    Format = format,
    Data = new { note = "Payable within 30 days, by bank transfer." },
    CreatedOn = DateTimeOffset.Now.ToString("o"),
});

File.WriteAllBytes("invoice-2026-0412.pdf", pdf);
