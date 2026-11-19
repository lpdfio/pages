import { L, LCrossIndustryInvoice } from '@lpdfio/lpdf'
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

const pdf = await LCrossIndustryInvoice.generatePdf(L.engine(), readFileSync('invoice-template.xml', 'utf8'), {
    invoiceXml,
    format,
    data: { note: 'Payable within 30 days, by bank transfer.' },
    createdOn: new Date().toISOString(),
})

writeFileSync('invoice-2026-0412.pdf', pdf)
