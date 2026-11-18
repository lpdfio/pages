# The default invoice map

`LCrossIndustryInvoice` reads the values of a Factur-X / ZUGFeRD invoice's XML through a map, and Lpdf's default map applies when a call is given none. This page lists the names it gives, from the map itself, which [you can download](/schema/cross-industry-invoice-map.xml) to start a map of your own. Each comes with the number and the name EN 16931 gives it: BT for a value, BG for a group of them, and BT-X for a value only the EXTENDED profile has.

A template binds a value under the map's prefix, `invoice:`, as `invoice:seller.name`, and repeats an element over a list with `data-source="invoice:lines"`, inside which it binds the item's values by their own names, `name` or `net`. Code reads the same names from what `extractInvoiceData` returns: `invoiceData.seller.name`, and `line.net` for each item of `invoiceData.lines`. See [LCrossIndustryInvoice](?p=cross-industry-invoice).

A value the invoice lacks is absent, and a list with no items is empty. A value marked required stops the call with an error that names it when the invoice lacks it, and a required list needs one item. A value of the type `date`, `amount` or `code` goes through the `format` function of its type, with the name in the first column, before it is bound.

## The invoice

| Name | EN 16931 | Kind |
|---|---|---|
| `number` | BT-1 Invoice number | text, required |
| `typeCode` | BT-3 Invoice type code | code, required |
| `issued` | BT-2 Invoice issue date | date, required |
| `buyerReference` | BT-10 Buyer reference | text |
| `orderReference` | BT-13 Purchase order reference | text |
| `notes` | BG-1 Invoice note | list |
| `notes.content` | BT-22 Invoice note | text |
| `notes.subjectCode` | BT-21 Invoice note subject code | code |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `salesOrderReference` | BT-14 Sales order reference | text |
| `contractReference` | BT-12 Contract reference | text |
| `projectReference` | BT-11 Project reference | text |
| `projectName` | BT-11-0 Project name | text |
| `tenderReferences` | Tender or lot references, which EXTENDED lets repeat | list |
| `tenderReferences.id` | BT-17 Tender or lot reference | text |
| `invoicedObjects` | Invoiced objects, which EXTENDED lets repeat | list |
| `invoicedObjects.id` | BT-18 Invoiced object identifier | text |
| `invoicedObjects.scheme` | BT-18-1 Invoiced object identifier scheme | code |
| `businessProcess` | BT-23 Business process type | text |
| `specification` | BT-24 Specification identifier | text |

## The seller

| Name | EN 16931 | Kind |
|---|---|---|
| `seller` | BG-4 Seller | group, required |
| `seller.name` | BT-27 Seller name | text, required |
| `seller.street` | BT-35 Seller address line 1 | text |
| `seller.postcode` | BT-38 Seller post code | text |
| `seller.city` | BT-37 Seller city | text |
| `seller.country` | BT-40 Seller country code | code, required |
| `seller.vatId` | BT-31 Seller VAT identifier | text |
| `seller.taxId` | BT-32 Seller tax registration identifier | text |
| `seller.contacts` | BG-6 Seller contact | list |
| `seller.contacts.name` | BT-41 Seller contact point | text |
| `seller.contacts.department` | BT-41-0 Seller contact department | text |
| `seller.contacts.phone` | BT-42 Seller contact telephone number | text |
| `seller.contacts.email` | BT-43 Seller contact email address | text |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `seller.tradingName` | BT-28 Seller trading name | text |
| `seller.legalId` | BT-30 Seller legal registration identifier | text |
| `seller.legalIdScheme` | BT-30-1 Seller legal registration identifier scheme | code |
| `seller.street2` | BT-36 Seller address line 2 | text |
| `seller.street3` | BT-162 Seller address line 3 | text |
| `seller.region` | BT-39 Seller country subdivision | text |
| `seller.legalInformation` | BT-33 Seller additional legal information | text |
| `seller.electronicAddress` | BT-34 Seller electronic address | text |
| `seller.electronicAddressScheme` | BT-34-1 Seller electronic address scheme | code |

## The buyer

| Name | EN 16931 | Kind |
|---|---|---|
| `buyer` | BG-7 Buyer | group, required |
| `buyer.name` | BT-44 Buyer name | text, required |
| `buyer.street` | BT-50 Buyer address line 1 | text |
| `buyer.postcode` | BT-53 Buyer post code | text |
| `buyer.city` | BT-52 Buyer city | text |
| `buyer.country` | BT-55 Buyer country code | code |
| `buyer.vatId` | BT-48 Buyer VAT identifier | text |
| `buyer.contacts` | BG-9 Buyer contact | list |
| `buyer.contacts.name` | BT-56 Buyer contact point | text |
| `buyer.contacts.department` | BT-56-0 Buyer contact department | text |
| `buyer.contacts.phone` | BT-57 Buyer contact telephone number | text |
| `buyer.contacts.email` | BT-58 Buyer contact email address | text |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `buyer.tradingName` | BT-45 Buyer trading name | text |
| `buyer.legalId` | BT-47 Buyer legal registration identifier | text |
| `buyer.legalIdScheme` | BT-47-1 Buyer legal registration identifier scheme | code |
| `buyer.street2` | BT-51 Buyer address line 2 | text |
| `buyer.street3` | BT-163 Buyer address line 3 | text |
| `buyer.region` | BT-54 Buyer country subdivision | text |
| `buyer.electronicAddress` | BT-49 Buyer electronic address | text |
| `buyer.electronicAddressScheme` | BT-49-1 Buyer electronic address scheme | code |

## The lines

| Name | EN 16931 | Kind |
|---|---|---|
| `lines` | BG-25 Invoice line | list, required |
| `lines.id` | BT-126 Invoice line identifier | text |
| `lines.name` | BT-153 Item name | text |
| `lines.description` | BT-154 Item description | text |
| `lines.quantity` | BT-129 Invoiced quantity | text |
| `lines.unit` | BT-130 Invoiced quantity unit of measure | code |
| `lines.unitPrice` | BT-146 Item net price | amount |
| `lines.vatRate` | BT-152 Invoiced item VAT rate | text |
| `lines.vatCategory` | BT-151 Invoiced item VAT category code | code |
| `lines.net` | BT-131 Invoice line net amount | amount |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `lines.sellerItemId` | BT-155 Item Seller's identifier | text |
| `lines.buyerItemId` | BT-156 Item Buyer's identifier | text |
| `lines.standardItemId` | BT-157 Item standard identifier | text |
| `lines.standardItemIdScheme` | BT-157-1 Item standard identifier scheme | code |
| `lines.originCountry` | BT-159 Item country of origin | code |
| `lines.customsCode` | BT-158 Item classification identifier, scheme HS | text |
| `lines.grossPrice` | BT-148 Item gross price | amount |
| `lines.grossPriceBaseQuantity` | BT-149-1 Item gross price base quantity | text |
| `lines.grossPriceBaseUnit` | BT-150-1 Item gross price base quantity unit of measure code | code |
| `lines.priceBaseQuantity` | BT-149 Item price base quantity | text |
| `lines.priceBaseUnit` | BT-150 Item price base quantity unit of measure code | code |
| `lines.orderReference` | BT-X-21 Purchase order reference of the line | text |
| `lines.orderLine` | BT-132 Referenced purchase order line reference | text |
| `lines.periodStart` | BT-134 Invoice line period start date | date |
| `lines.periodEnd` | BT-135 Invoice line period end date | date |
| `lines.parentId` | BT-X-304 Parent line identifier | text |
| `lines.status` | BT-X-8 Line status reason code | code |

## The VAT breakdown

| Name | EN 16931 | Kind |
|---|---|---|
| `taxes` | BG-23 VAT breakdown | list |
| `taxes.rate` | BT-119 VAT category rate | text |
| `taxes.basis` | BT-116 VAT category taxable amount | amount |
| `taxes.amount` | BT-117 VAT category tax amount | amount |
| `taxes.category` | BT-118 VAT category code | code |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `taxes.exemptionReason` | BT-120 VAT exemption reason text | text |
| `taxes.exemptionReasonCode` | BT-121 VAT exemption reason code | code |
| `taxes.pointDate` | BT-7 Value added tax point date | date |
| `taxes.pointDateCode` | BT-8 Value added tax point date code | code |

## The totals

| Name | EN 16931 | Kind |
|---|---|---|
| `totals` | BG-22 Document totals | group, required |
| `totals.currency` | BT-5 Invoice currency code | code, required |
| `totals.lineTotal` | BT-106 Sum of Invoice line net amount | amount, required |
| `totals.net` | BT-109 Invoice total amount without VAT | amount, required |
| `totals.vat` | BT-110 Invoice total VAT amount | amount |
| `totals.gross` | BT-112 Invoice total amount with VAT | amount, required |
| `totals.due` | BT-115 Amount due for payment | amount, required |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `totals.allowances` | BT-107 Sum of allowances on document level | amount |
| `totals.charges` | BT-108 Sum of charges on document level | amount |
| `totals.prepaid` | BT-113 Paid amount | amount |
| `totals.rounding` | BT-114 Rounding amount | amount |
| `totals.taxCurrency` | BT-6 VAT accounting currency code | code |
| `totals.vatInTaxCurrency` | BT-111 Invoice total VAT amount in accounting currency | amount |

## Payment

| Name | EN 16931 | Kind |
|---|---|---|
| `paymentTerms` | Payment terms, which EXTENDED lets repeat | list |
| `paymentTerms.description` | BT-20 Payment terms | text |
| `paymentTerms.due` | BT-9 Payment due date | date |
| `paymentTerms.mandateId` | BT-89 Mandate reference identifier | text |
| `payment` | How to pay | group |
| `payment.reference` | BT-83 Remittance information | text |
| `payment.means` | BG-16 Payment instructions | list |
| `payment.means.typeCode` | BT-81 Payment means type code | code |
| `payment.means.information` | BT-82 Payment means text | text |
| `payment.means.iban` | BT-84 Payment account identifier, BG-17 Credit transfer | text |
| `payment.means.accountId` | BT-84 Payment account identifier, when it is no IBAN | text |
| `payment.means.accountName` | BT-85 Payment account name | text |
| `payment.means.bic` | BT-86 Payment service provider identifier | text |
| `payment.means.cardNumber` | BT-87 Payment card primary account number, BG-18 Payment card information | text |
| `payment.means.cardHolder` | BT-88 Payment card holder name | text |
| `payment.means.debitedIban` | BT-91 Debited account identifier, BG-19 Direct debit | text |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `payment.creditorId` | BT-90 Bank assigned creditor identifier | text |
| `payment.accountingReferences` | Buyer accounting references, which EXTENDED lets repeat | list |
| `payment.accountingReferences.id` | BT-19 Buyer accounting reference | text |
| `payee` | BG-10 Payee | group |
| `payee.name` | BT-59 Payee name | text |
| `payee.legalId` | BT-61 Payee legal registration identifier | text |
| `payee.legalIdScheme` | BT-61-1 Payee legal registration identifier scheme | code |

## References

| Name | EN 16931 | Kind |
|---|---|---|
| `precedingInvoices` | BG-3 Preceding invoice reference | list |
| `precedingInvoices.number` | BT-25 Preceding Invoice reference | text |
| `precedingInvoices.issued` | BT-26 Preceding Invoice issue date | date |
| `documents` | BG-24 Additional supporting documents | list |
| `documents.id` | BT-122 Supporting document reference | text |
| `documents.typeCode` | 916 a supporting document, 50 a tender, 130 an invoiced object | code |
| `documents.description` | BT-123 Supporting document description | text |
| `documents.url` | BT-124 External document location | text |
| `documents.file` | BT-125-2 Attached document Filename | text |
| `documents.fileType` | BT-125-1 Attached document Mime code | text |
| `period` | BG-14 Invoicing period | group |
| `period.start` | BT-73 Invoicing period start date | date |
| `period.end` | BT-74 Invoicing period end date | date |

## Delivery

| Name | EN 16931 | Kind |
|---|---|---|
| `delivery` | BG-13 Delivery information | group |
| `delivery.date` | BT-72 Actual delivery date | date |
| `delivery.name` | BT-70 Deliver to party name | text |
| `delivery.street` | BT-75 Deliver to address line 1 | text |
| `delivery.postcode` | BT-78 Deliver to post code | text |
| `delivery.city` | BT-77 Deliver to city | text |
| `delivery.country` | BT-80 Deliver to country code | code |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `delivery.street2` | BT-76 Deliver to address line 2 | text |
| `delivery.street3` | BT-165 Deliver to address line 3 | text |
| `delivery.region` | BT-79 Deliver to country subdivision | text |
| `delivery.despatchAdviceReference` | BT-16 Despatch advice reference | text |
| `delivery.receivingAdviceReference` | BT-15 Receiving advice reference | text |

## Allowances and charges on the invoice

| Name | EN 16931 | Kind |
|---|---|---|
| `allowanceCharges` | BG-20 Document level allowances, BG-21 Document level charges | list |
| `allowanceCharges.charge` | true for a charge, false for an allowance | code |
| `allowanceCharges.amount` | BT-92 Document level allowance amount, BT-99 charge amount | amount |
| `allowanceCharges.reason` | BT-97 Document level allowance reason, BT-104 charge reason | text |
| `allowanceCharges.vatRate` | BT-96 Document level allowance VAT rate, BT-103 charge VAT rate | text |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `allowanceCharges.basis` | BT-93 Document level allowance base amount, BT-100 charge base amount | amount |
| `allowanceCharges.percent` | BT-94 Document level allowance percentage, BT-101 charge percentage | text |
| `allowanceCharges.reasonCode` | BT-98 Document level allowance reason code, BT-105 charge reason code | code |
| `allowanceCharges.vatCategory` | BT-95 Document level allowance VAT category code, BT-102 charge VAT category code | code |

## The seller's tax representative

| Name | EN 16931 | Kind |
|---|---|---|
| `taxRepresentative` | BG-11 Seller tax representative party | group |
| `taxRepresentative.name` | BT-62 Seller tax representative name | text |
| `taxRepresentative.street` | BT-64 Tax representative address line 1 | text |
| `taxRepresentative.postcode` | BT-67 Tax representative post code | text |
| `taxRepresentative.city` | BT-66 Tax representative city | text |
| `taxRepresentative.country` | BT-69 Tax representative country code | code |
| `taxRepresentative.vatId` | BT-63 Seller tax representative VAT identifier | text |

Less common:

| Name | EN 16931 | Kind |
|---|---|---|
| `taxRepresentative.street2` | BT-65 Tax representative address line 2 | text |
| `taxRepresentative.street3` | BT-164 Tax representative address line 3 | text |
| `taxRepresentative.region` | BT-68 Tax representative country subdivision | text |
