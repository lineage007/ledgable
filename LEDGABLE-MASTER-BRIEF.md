# LEDGABLE — Master Product Brief
**Domain:** ledgable.co
**Registered:** March 19, 2026
**Market:** Australia-first
**Positioning:** AI-native accounting that kills Xero on price and UX

---

## THE PITCH
Xero charges $33–92/mo for bloated software built for accountants, not business owners.
Ledgable charges $9–29/mo for software built for the business owner first, with the accountant invited in.

## TARGET CUSTOMER
- Australian freelancers, sole traders, SMEs (under 20 staff)
- Currently on Xero but hate the price / complexity
- Currently on spreadsheets and scared of BAS time
- New businesses that want to start clean

## PRICING
| Plan | Price | Who |
|------|-------|-----|
| Solo | $9/mo | Freelancers, sole traders |
| Business | $19/mo | SMEs, up to 5 users |
| Pro | $29/mo | Growing businesses, unlimited users |
| Accountant | $49/mo | Accountants — unlimited client dashboards |

## CORE FEATURE SET

### Foundation (TaxHacker fork — MIT licensed)
- AI receipt & invoice scanning (photo/PDF → structured data)
- Multi-currency with historical exchange rates
- Full-text search across all documents
- Custom categories and AI extraction prompts
- CSV export with attachments

### AU-Specific Layer (our build)
- **Bank Feeds** — Basiq API (CDR-compliant, all AU banks)
- **GST tracking** — auto-classify transactions as GST/GST-free/input-taxed
- **BAS preparation** — auto-populate W1, W2, G1, G2, G3, G10, G11
- **ATO lodgments** — SBR API (BAS, IAS, STP)
- **Single Touch Payroll (STP)** — ATO-compliant payroll reporting
- **PAYG Withholding** — auto-calculate, report to ATO

### Smart Money Layer (differentiator)
- **Money Rules** — set allocation rules (e.g. 20% discretionary, 35% household, 10% investment)
- **Cashflow Forecasting** — 30/60/90 day projections based on actuals
- **AI Tax Advisor** — "You're on track to owe $12,400 this quarter. Consider prepaying super."
- **Budget vs Actuals** — real-time comparison
- **Spending Insights** — category trends, anomalies

### Growth Features
- Invoicing & quotes (with AU-compliant tax invoice format)
- Client portal (send invoices, accept payment)
- Stripe / PayID integration
- Accountant portal (manage multiple clients)
- Mobile app (Flutter — iOS + Android)

---

## TECHNICAL STACK
- **Base:** Fork of TaxHacker (Next.js 15 + PostgreSQL + Prisma)
- **Bank feeds:** Basiq API (CDR-accredited)
- **ATO integration:** SBR (Standard Business Reporting) — government API
- **AI:** Claude Sonnet (receipt extraction, categorisation, tax advice)
- **Auth:** Supabase
- **Hosting:** Vercel (app) + Supabase (DB)
- **Mobile:** Flutter (later phase)

## BUILD PHASES

### Phase 1 — MVP (weeks 1–8)
- Fork TaxHacker, rebrand as Ledgable
- Add bank feeds (Basiq)
- GST classification engine
- BAS preparation module
- Basic dashboard + onboarding
- Launch at ledgable.co

### Phase 2 — Growth (months 3–6)
- ATO lodgment via SBR API
- STP payroll
- Invoicing
- Money Rules / budgeting
- Mobile app

### Phase 3 — Platform (months 6–12)
- Accountant portal
- Open banking wealth view
- AI tax advisor
- White-label for accountants

---

## CRITICAL PATH — ATO Registration
To lodge BAS/STP with ATO, must register as Software Developer:
- Apply at: sbr.gov.au/digital-service-providers
- Timeline: 2–4 weeks
- Cost: Free
- Requirement: Australian ABN (Lineage entity can hold this)
- This is the moat — start immediately

## COMPETITIVE MOAT
1. Price (3–5x cheaper than Xero)
2. AI-native (receipt scanning, smart categorisation, tax forecasting)
3. UX built for owners not accountants
4. Money Rules feature (no competitor has this)
5. ATO lodgment without needing an accountant

## REVENUE PROJECTIONS
| Month | Subscribers | MRR |
|-------|-------------|-----|
| 3 | 200 | $2,800 |
| 6 | 1,000 | $14,000 |
| 12 | 5,000 | $70,000 |
| 24 | 20,000 | $280,000 |

---
*Brief created: March 19, 2026*
