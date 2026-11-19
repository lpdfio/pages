<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use Lpdf\Engine\GeneratePdfOptions;
use Lpdf\Engine\InvoiceFormat;
use Lpdf\L;
use Lpdf\LCrossIndustryInvoice;

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

$pdf = LCrossIndustryInvoice::generatePdf(L::engine(), file_get_contents('invoice-template.xml'), new GeneratePdfOptions(
    invoiceXml: $invoiceXml,
    format: $format,
    data: ['note' => 'Payable within 30 days, by bank transfer.'],
    createdOn: date('c'),
));

file_put_contents('invoice-2026-0412.pdf', $pdf);
