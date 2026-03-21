# Ledgable V2 — Complete Product Specification

## Vision
The world's simplest, most powerful accounting platform for Australian small businesses.
Cheaper than Xero. Smarter than QuickBooks. AI-native from day one.

## Pricing
- **Client**: AUD $19/mo
- **Accountant gets**: $5/mo per client (passive revenue)
- **Ledgable nets**: $14/mo per client

## Competitive Edge vs Xero/QBO/MYOB
1. **AI-First**: Every feature has an AI layer (natural language queries, auto-categorization, predictive forecasting)
2. **Half the price**: $19/mo vs Xero $39-78/mo, QBO $30-200/mo
3. **Built for AU**: GST, BAS, STP, bank feeds via Basiq — not a US product adapted for AU
4. **Accountant network**: Built-in rev-share model incentivizes accountant adoption
5. **Modern UX**: Clean, minimal, fast — not the dated interfaces of incumbents

---

## Core Features (Must-Have — Matching Xero)

### 1. Dashboard
- P&L summary (MTD, QTD, YTD)
- Cash position across all accounts
- Outstanding invoices / overdue
- Upcoming bills
- Cashflow forecast (30/60/90 day)
- AI insight cards ("You spent 23% more on software this month")

### 2. Bank Feeds
- **Basiq API** integration (250+ AU banks — CBA, ANZ, Westpac, NAB, etc.)
- Real-time transaction sync
- AI auto-categorization (98% accuracy target)
- Bank reconciliation with smart matching
- Manual import (CSV, OFX, QIF)

### 3. Invoicing
- Professional invoice templates (3+ designs)
- Auto-numbering, due dates, payment terms
- Send via email directly
- Payment links (Stripe integration)
- Recurring invoices
- Overdue reminders (automated)
- Credit notes

### 4. Bills & Expenses
- Receipt scanning (camera + upload)
- AI extraction (merchant, amount, GST, date, category)
- Bill approval workflows
- Scheduled payments
- Expense claims

### 5. GST & BAS
- Auto GST calculation on all transactions
- BAS preparation (quarterly/monthly)
- GST summary report
- **ATO API integration** for direct BAS lodgment
- IAS (Instalment Activity Statement)

### 6. Contacts
- Customer and supplier management
- Transaction history per contact
- Outstanding balances
- ABN lookup integration

### 7. Chart of Accounts
- AU standard chart pre-loaded
- Customizable
- Sub-accounts
- Tracking categories (departments, projects, locations)

### 8. Reports
- Profit & Loss
- Balance Sheet
- Cash Flow Statement
- Aged Receivables / Payables
- Trial Balance
- GST Report
- Budget vs Actual
- Custom date ranges, comparison periods
- Export to PDF/Excel

### 9. Payroll (Phase 2)
- Single Touch Payroll (STP) compliance
- Leave management
- Super calculation
- Pay runs
- Payslips

---

## Differentiating Features (Beyond Competitors)

### 10. AI Assistant ("Ask Ledge")
- Natural language queries: "How much did I spend on marketing last quarter?"
- Transaction search: "Show me all payments to Telstra"
- Forecasting: "What will my cash position be in 60 days?"
- Anomaly alerts: "This invoice is 3x your average from this supplier"
- BAS preparation helper
- Powered by Gemini Flash (fast, cheap)

### 11. Money Rules Engine
- "Save 20% of every deposit over $5,000"
- "Flag any expense over $500 for review"
- "Auto-categorize Uber as Travel"
- "Alert me when cash drops below $10,000"
- Visual rule builder (if/then)

### 12. Smart Budgets
- Category-level budgets
- Percentage-based allocation (20% discretionary, 35% household, etc.)
- Real-time tracking vs budget
- AI recommendations based on spending patterns

### 13. Cashflow Forecasting
- ML-based prediction using historical patterns
- Scenario modeling (best/worst/likely)
- "What if I hire 2 more people?" modeling
- Visual timeline with upcoming bills/invoices overlaid

### 14. Wallet / Spending Strategy
- Virtual envelopes for different spending categories
- Auto-allocation of income
- Visual progress bars
- "You've used 67% of your Entertainment budget this month"

---

## Accountant Portal

### 15. Firm Dashboard
- All clients at a glance (traffic light status)
- Total MRR earned
- Client health scores
- Bulk actions (send reminders, request documents)

### 16. Client Management
- Add client (email invite with referral code)
- Bulk import (CSV)
- Client activity timeline
- Access client books (read/write toggle)
- Document requests

### 17. Revenue Tracking
- Monthly commission per client ($5/mo)
- Payout history
- Stripe Connect integration (auto-split)
- Tax invoice generation for firm

### 18. Practice Tools
- Client grouping (by industry, size, status)
- Deadline tracker (BAS due dates, tax returns)
- Workpaper templates
- Client portal (clients upload docs here)

---

## Data Migration

### 19. Import Wizard
- **Xero** (OAuth2 → chart of accounts, invoices, bills, contacts, bank transactions, journal entries)
- **QuickBooks Online** (OAuth2 → same dataset)
- **MYOB** (API → AU-specific data structures)
- **CSV** (universal fallback)
- Progress tracking with status updates
- Data mapping screen (match their categories to ours)
- Validation report before finalizing

---

## Design System

### Colors
- **Primary**: Emerald #10B981
- **Secondary**: Teal #0D9488
- **Background**: #0D1117 (dark) / #FAFAFA (light)
- **Surface**: #161B22 (dark) / #FFFFFF (light)
- **Text**: #F0F6FC (dark) / #1F2937 (light)
- **Accent**: #34D399 (success), #F59E0B (warning), #EF4444 (error)
- **Gold**: #D4A857 (premium accents)

### Typography
- **Headings**: Inter 700
- **Body**: Inter 400
- **Mono**: JetBrains Mono (numbers, codes)

### Components
- Rounded corners (12px cards, 8px buttons)
- Subtle shadows
- Glass morphism for overlays
- Micro-animations on state changes
- Skeleton loading states
- Dark mode default, light mode toggle
