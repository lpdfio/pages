<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use Lpdf\Engine\ExtractInvoiceDataOptions;
use Lpdf\Engine\GeneratePdfOptions;
use Lpdf\Engine\InvoiceFormat;
use Lpdf\Kit\DocumentAssets;
use Lpdf\Kit\DocumentAttr;
use Lpdf\Kit\DocumentMeta;
use Lpdf\Kit\FontAttr;
use Lpdf\Kit\ImageAttr;
use Lpdf\Kit\LayoutAttr;
use Lpdf\L;
use Lpdf\LCrossIndustryInvoice;
use Lpdf\Layout\ColumnAttr;
use Lpdf\Layout\DividerAttr;
use Lpdf\Layout\ImgAttr;
use Lpdf\Layout\RowAttr;
use Lpdf\Layout\TableAttr;
use Lpdf\Layout\TdAttr;
use Lpdf\Layout\TextAttr;
use const Lpdf\NoAttr;

// The invoice's XML, as your accounting software wrote it. Any file name works.
$invoiceXml = file_get_contents('in/invoice-2026-0412.xml');

// How values are written on the page: the language's own formatters, and the words for the codes.
$codeNames = [
    'typeCode'   => [380 => 'Invoice', 381 => 'Credit note'],
    'lines.unit' => ['H87' => 'pcs', 'KGM' => 'kg'],
];
$format = new InvoiceFormat(
    date: fn (string $value): string => (new DateTimeImmutable($value))->format('j F Y'),
    amount: fn (string $value): string => number_format((float) $value, 2),
    code: fn (string $value, string $entryName): string => $codeNames[$entryName][$value] ?? $value,
);

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
$invoice = LCrossIndustryInvoice::extractInvoiceData($invoiceXml, new ExtractInvoiceDataOptions(format: $format));
$note = 'Payable within 30 days, by bank transfer.';
['seller' => $seller, 'buyer' => $buyer, 'totals' => $totals] = $invoice;

// Attributes used more than once.
$muted      = new TextAttr(fontSize: '9pt', color: '#5b6475');
$mutedRight = new TextAttr(fontSize: '9pt', color: '#5b6475', align: 'right');
$right      = new TextAttr(align: 'right');
$title      = new TextAttr(fontSize: '20pt', color: '#0f4c5c');
$total      = new TextAttr(fontSize: '14pt');
$cell       = new TdAttr(padding: 'xs 0');
$endRow     = new RowAttr(gap: 'xs', justify: 'end');

$doc = L::document(new DocumentAttr(
    size: 'A4',
    font: 'body',
    assets: new DocumentAssets(
        fonts: [new FontAttr(name: 'body', src: 'fonts/SourceSans3-Regular.otf')],
        images: [new ImageAttr(name: 'logo', src: 'logo.png')],
    ),
    meta: new DocumentMeta(title: 'Invoice', author: 'Northwind Paper SAS', lang: 'en'),
), [
    L::section(NoAttr, [
        L::layout(new LayoutAttr(margin: '48pt'), [
            L::column(new ColumnAttr(gap: 'l'), [
                L::row(new RowAttr(align: 'center'), [
                    L::column(new ColumnAttr(width: 'fill'), [L::img(new ImgAttr(name: 'logo', width: '130pt'))]),
                    L::row(new RowAttr(gap: 'xs'), [L::text($title, [$invoice['typeCode']]), L::text($title, [$invoice['number']])]),
                ]),
                L::divider(new DividerAttr(color: '#dde3ed', thickness: '0.5pt')),
                L::row(new RowAttr(gap: 'l'), [
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::text($muted, ['From']),
                        L::text(NoAttr, [$seller['name']]),
                        L::text(NoAttr, [$seller['street']]),
                        L::row(new RowAttr(gap: 'xs'), [L::text(NoAttr, [$seller['postcode']]), L::text(NoAttr, [$seller['city']])]),
                        L::row(new RowAttr(gap: 'xs'), [L::text(NoAttr, ['VAT']), L::text(NoAttr, [$seller['vatId']])]),
                    ]),
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::text($muted, ['Billed to']),
                        L::text(NoAttr, [$buyer['name']]),
                        L::text(NoAttr, [$buyer['street']]),
                        L::row(new RowAttr(gap: 'xs'), [L::text(NoAttr, [$buyer['postcode']]), L::text(NoAttr, [$buyer['city']])]),
                    ]),
                    L::column(new ColumnAttr(width: 'fill', gap: 'xs'), [
                        L::text($muted, ['Issued · Due']),
                        L::text(NoAttr, [$invoice['issued']]),
                        // A list is a map over an array: one line for each payment term.
                        ...array_map(fn (array $term) => L::text(NoAttr, [$term['due']]), $invoice['paymentTerms']),
                    ]),
                ]),
                L::table(new TableAttr(cols: '4fr 1fr 1fr 1fr 1fr 1fr', headBorder: 'xs line', rowBorder: 'xs line-muted'), [
                    L::thead(NoAttr, [
                        L::td($cell, [L::text($muted, ['Item'])]),
                        L::td($cell, [L::text($mutedRight, ['Qty'])]),
                        L::td($cell, [L::text($mutedRight, ['Unit'])]),
                        L::td($cell, [L::text($mutedRight, ['Price'])]),
                        L::td($cell, [L::text($mutedRight, ['VAT %'])]),
                        L::td($cell, [L::text($mutedRight, ['Amount'])]),
                    ]),
                    ...array_map(fn (array $line) => L::tr(NoAttr, [
                        L::td($cell, [L::text(NoAttr, [$line['name']])]),
                        L::td($cell, [L::text($right, [$line['quantity']])]),
                        L::td($cell, [L::text($right, [$line['unit']])]),
                        L::td($cell, [L::text($right, [$line['unitPrice']])]),
                        L::td($cell, [L::text($right, [$line['vatRate']])]),
                        L::td($cell, [L::text($right, [$line['net']])]),
                    ]), $invoice['lines']),
                ]),
                L::row(new RowAttr(justify: 'end'), [
                    L::column(new ColumnAttr(width: '220pt', gap: 's'), [
                        L::table(new TableAttr(cols: '1fr 1fr 1fr'), [
                            L::thead(NoAttr, [
                                L::td(NoAttr, [L::text($muted, ['VAT %'])]),
                                L::td(NoAttr, [L::text($mutedRight, ['Basis'])]),
                                L::td(NoAttr, [L::text($mutedRight, ['VAT'])]),
                            ]),
                            ...array_map(fn (array $tax) => L::tr(NoAttr, [
                                L::td(NoAttr, [L::text(NoAttr, [$tax['rate']])]),
                                L::td(NoAttr, [L::text($right, [$tax['basis']])]),
                                L::td(NoAttr, [L::text($right, [$tax['amount']])]),
                            ]), $invoice['taxes']),
                        ]),
                        L::divider(new DividerAttr(color: '#dde3ed', thickness: '0.5pt')),
                        L::column(new ColumnAttr(gap: 'xs'), [
                            L::row($endRow, [L::text(NoAttr, ['VAT']), L::text(NoAttr, [$totals['vat']]), L::text(NoAttr, [$totals['currency']])]),
                            // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                            ...(isset($totals['vatInTaxCurrency']) ? [L::row($endRow, [
                                L::text($muted, ['VAT in']),
                                L::text($muted, [$totals['taxCurrency']]),
                                L::text($muted, [$totals['vatInTaxCurrency']]),
                            ])] : []),
                            L::row($endRow, [L::text($total, ['Total']), L::text($total, [$totals['gross']]), L::text($total, [$totals['currency']])]),
                        ]),
                    ]),
                ]),
                ...($note !== '' ? [L::text($muted, [$note])] : []),
            ]),
        ]),
    ]),
]);

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), $doc, new GeneratePdfOptions(invoiceXml: $invoiceXml, createdOn: date('c')));

file_put_contents('invoice-2026-0412-code.pdf', $pdf);
