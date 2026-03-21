# Ledgable Competitive Audit — Field-Level Comparison

## Sources: Xero API, QuickBooks Online AU, MYOB AccountRight

---

## 1. CONTACTS (Customers + Suppliers) — ❌ MISSING

**What Xero/QBO/MYOB all have:**
- Contact name (company + first/last name)
- ABN (Australian Business Number) — **CRITICAL for AU**
- ACN (Australian Company Number)
- Email, phone (4 types: default, DDI, mobile, fax)
- Website
- Addresses: billing (POBOX) + delivery (STREET) — separate
- IsCustomer / IsSupplier toggle
- Bank account details (BSB + account for paying them)
- Default currency
- Payment terms (Net 7/14/30/60)
- Tax type defaults (sales + purchases)
- Outstanding balance / Overdue amounts
- Contact status (active/archived)
- Notes

**What we have:** Nothing. No contacts model at all.

---

## 2. INVOICES (Sales) — ❌ MISSING (we have UI but no data model)

**What competitors have:**
- Invoice number (auto-incrementing, customizable prefix)
- Type: ACCREC (sales) / ACCPAY (bills)
- Contact link
- Reference field
- Status: Draft → Submitted → Authorised → Paid / Voided
- Date + Due Date + Expected Payment Date
- Line items with:
  - Description
  - Quantity + Unit Amount
  - Account code (from Chart of Accounts)
  - Tax type per line
  - Discount rate
  - Tracking categories (2 dimensions)
  - Item code link
- Line amount types: Tax Exclusive / Tax Inclusive / No Tax
- Subtotal, TotalTax, Total
- AmountDue, AmountPaid, AmountCredited
- Currency + exchange rate
- Payments applied
- Credit notes applied
- Branding theme
- Attachments
- Online payment link
- Sent to contact flag
- Repeating invoice link

**What we have:** A client-side UI with no database model.

---

## 3. BILLS (Purchases) — ❌ MISSING

Same as invoices but ACCPAY type. Xero uses one model for both.

---

## 4. QUOTES / ESTIMATES — ❌ MISSING

**What competitors have:**
- Quote number
- Contact, date, expiry date
- Line items (same as invoices)
- Status: Draft → Sent → Accepted → Declined → Invoiced
- Convert to Invoice action
- Terms and conditions

---

## 5. PURCHASE ORDERS — ❌ MISSING

**What competitors have:**
- PO number
- Supplier contact
- Delivery address + date
- Line items
- Status: Draft → Submitted → Authorised → Billed
- Convert to Bill action

---

## 6. CHART OF ACCOUNTS — ❌ MISSING

**What competitors have:**
- Account code (e.g., 200, 400, 800)
- Account name
- Account type: Asset / Liability / Equity / Revenue / Expense
- Tax type default
- Description
- System account flag (can't delete)
- Bank account details
- Currency
- Enable payments flag

**AU Standard CoA typically includes:**
- 100-199: Assets
- 200-299: Liabilities
- 300-399: Equity
- 400-499: Revenue
- 500-899: Expenses

---

## 7. ITEMS / PRODUCTS / SERVICES — ❌ MISSING

**What competitors have:**
- Item code
- Item name
- Description (purchase + sale)
- Purchase price + sale price
- Purchase account + sale account
- Purchase tax type + sale tax type
- Inventory tracked (yes/no)
- Quantity on hand
- Cost of goods sold account

---

## 8. TAX RATES (AU-specific) — ❌ MISSING

**Australian GST codes required:**
- GST on Income (10%)
- GST on Expenses (10%)
- GST Free Income (0%)
- GST Free Expenses (0%)
- Input Taxed (0%)
- BAS Excluded
- GST on Imports
- Export (0%)

---

## 9. PAYMENTS — ❌ MISSING

**What competitors have:**
- Payment date
- Amount
- Invoice/bill reference
- Bank account
- Reference number
- Currency + rate
- Batch payments support

---

## 10. CREDIT NOTES — ❌ MISSING

---

## 11. TRACKING CATEGORIES — ❌ MISSING (Xero's killer feature)

Two customizable dimensions (e.g., "Department" + "Region") that can be applied to any line item for reporting.

---

## 12. BUSINESS SETTINGS — ⚠️ PARTIAL

**What competitors have:**
- Business name, ABN, ACN
- Business address
- Logo
- Financial year end (AU: June 30)
- GST registration status
- BAS reporting period (monthly/quarterly)
- Default currency (AUD)
- Lock dates
- Multi-currency support

**What we have:** businessName, businessAddress, businessBankDetails, businessLogo on User model. No ABN/ACN, no financial year, no GST registration, no lock dates.

---

## PRIORITY ORDER FOR IMPLEMENTATION:

1. **Contacts** — foundation for everything else
2. **Chart of Accounts** — with AU defaults
3. **Invoices + Bills** — proper data model
4. **Tax Rates** — AU GST codes
5. **Items/Products**
6. **Payments**
7. **Quotes**
8. **Purchase Orders**
9. **Credit Notes**
10. **Tracking Categories**
