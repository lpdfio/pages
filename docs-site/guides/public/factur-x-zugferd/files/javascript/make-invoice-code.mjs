import { L, NoAttr, LCrossIndustryInvoice } from '@lpdfio/lpdf'
import { readFileSync, writeFileSync } from 'node:fs'

// The invoice's XML, as your accounting software wrote it. Any file name works.
const invoiceXml = readFileSync('in/invoice-2026-0412.xml')

// How values are written on the page: the language's own formatters, and the words for the codes.
const codeNames = {
    'typeCode':   { 380: 'Invoice', 381: 'Credit note' },
    'lines.unit': { H87: 'pcs', KGM: 'kg' },
}
const format = {
    date:   (value) => new Date(value).toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' }),
    amount: (value) => Number(value).toLocaleString('en-GB', { minimumFractionDigits: 2 }),
    code:   (value, entryName) => codeNames[entryName]?.[value] ?? value,
}

// The invoice's values as plain data, read from the XML. The note is not in the XML, so it is yours.
const invoice = LCrossIndustryInvoice.extractInvoiceData(invoiceXml, { format })
const note = 'Payable within 30 days, by bank transfer.'
const { seller, buyer, totals } = invoice

// Attributes used more than once.
const muted      = { fontSize: '9pt', color: '#5b6475' }
const mutedRight = { fontSize: '9pt', color: '#5b6475', align: 'right' }
const right      = { align: 'right' }
const title      = { fontSize: '20pt', color: '#0f4c5c' }
const total      = { fontSize: '14pt' }
const cell       = { padding: 'xs 0' }
const endRow     = { gap: 'xs', justify: 'end' }

const doc = L.document({
    size: 'a4',
    font: 'body',
    assets: {
        fonts: [{ name: 'body', src: 'fonts/SourceSans3-Regular.otf' }],
        images: [{ name: 'logo', src: 'logo.png' }],
    },
    meta: { title: 'Invoice', author: 'Northwind Paper SAS', lang: 'en' },
}, [
    L.section(NoAttr, [
        L.layout({ margin: '48pt' }, [
            L.column({ gap: 'l' }, [
                L.row({ align: 'center' }, [
                    L.column({ width: 'fill' }, [L.img({ name: 'logo', width: '130pt' })]),
                    L.row({ gap: 'xs' }, [L.text(title, [invoice.typeCode]), L.text(title, [invoice.number])]),
                ]),
                L.divider({ color: '#dde3ed', thickness: '0.5pt' }),
                L.row({ gap: 'l' }, [
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.text(muted, ['From']),
                        L.text(NoAttr, [seller.name]),
                        L.text(NoAttr, [seller.street]),
                        L.row({ gap: 'xs' }, [L.text(NoAttr, [seller.postcode]), L.text(NoAttr, [seller.city])]),
                        L.row({ gap: 'xs' }, [L.text(NoAttr, ['VAT']), L.text(NoAttr, [seller.vatId])]),
                    ]),
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.text(muted, ['Billed to']),
                        L.text(NoAttr, [buyer.name]),
                        L.text(NoAttr, [buyer.street]),
                        L.row({ gap: 'xs' }, [L.text(NoAttr, [buyer.postcode]), L.text(NoAttr, [buyer.city])]),
                    ]),
                    L.column({ width: 'fill', gap: 'xs' }, [
                        L.text(muted, ['Issued · Due']),
                        L.text(NoAttr, [invoice.issued]),
                        // A list is a map over an array: one line for each payment term.
                        ...invoice.paymentTerms.map((term) => L.text(NoAttr, [term.due])),
                    ]),
                ]),
                L.table({ cols: '4fr 1fr 1fr 1fr 1fr 1fr', headBorder: 'xs line', rowBorder: 'xs line-muted' }, [
                    L.thead(NoAttr, [
                        L.td(cell, [L.text(muted, ['Item'])]),
                        L.td(cell, [L.text(mutedRight, ['Qty'])]),
                        L.td(cell, [L.text(mutedRight, ['Unit'])]),
                        L.td(cell, [L.text(mutedRight, ['Price'])]),
                        L.td(cell, [L.text(mutedRight, ['VAT %'])]),
                        L.td(cell, [L.text(mutedRight, ['Amount'])]),
                    ]),
                    ...invoice.lines.map((line) => L.tr(NoAttr, [
                        L.td(cell, [L.text(NoAttr, [line.name])]),
                        L.td(cell, [L.text(right, [line.quantity])]),
                        L.td(cell, [L.text(right, [line.unit])]),
                        L.td(cell, [L.text(right, [line.unitPrice])]),
                        L.td(cell, [L.text(right, [line.vatRate])]),
                        L.td(cell, [L.text(right, [line.net])]),
                    ])),
                ]),
                L.row({ justify: 'end' }, [
                    L.column({ width: '220pt', gap: 's' }, [
                        L.table({ cols: '1fr 1fr 1fr' }, [
                            L.thead(NoAttr, [
                                L.td(NoAttr, [L.text(muted, ['VAT %'])]),
                                L.td(NoAttr, [L.text(mutedRight, ['Basis'])]),
                                L.td(NoAttr, [L.text(mutedRight, ['VAT'])]),
                            ]),
                            ...invoice.taxes.map((tax) => L.tr(NoAttr, [
                                L.td(NoAttr, [L.text(NoAttr, [tax.rate])]),
                                L.td(NoAttr, [L.text(right, [tax.basis])]),
                                L.td(NoAttr, [L.text(right, [tax.amount])]),
                            ])),
                        ]),
                        L.divider({ color: '#dde3ed', thickness: '0.5pt' }),
                        L.column({ gap: 'xs' }, [
                            L.row(endRow, [L.text(NoAttr, ['VAT']), L.text(NoAttr, [totals.vat]), L.text(NoAttr, [totals.currency])]),
                            // An optional line is an if: the VAT in the tax currency, when the invoice has one.
                            ...(totals.vatInTaxCurrency ? [L.row(endRow, [
                                L.text(muted, ['VAT in']),
                                L.text(muted, [totals.taxCurrency]),
                                L.text(muted, [totals.vatInTaxCurrency]),
                            ])] : []),
                            L.row(endRow, [L.text(total, ['Total']), L.text(total, [totals.gross]), L.text(total, [totals.currency])]),
                        ]),
                    ]),
                ]),
                ...(note ? [L.text(muted, [note])] : []),
            ]),
        ]),
    ]),
])

// Same call as the template's: it makes the file PDF/A-3 and attaches the XML.
const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), doc, { invoiceXml, createdOn: new Date().toISOString() })

writeFileSync('invoice-2026-0412-code.pdf', pdf)
