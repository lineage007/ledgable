# Ledgable — Brand Bible & Design System

*Last updated: March 21, 2026*

---

## Brand Identity

### Name
**Ledgable** — "Ledger" + "Able". AI-powered accounting made accessible.

### Wordmark
- Split colour treatment: **"ledg"** in navy/foreground + **"able"** in teal (#0D9488)
- Font: Plus Jakarta Sans, bold, tracking-tight
- Always lowercase: `ledgable` (never "Ledgable" in the logo itself)

### Icon
- **Donut icon** — the selected design (circular with cutout)
- Files: `/public/logo/donut-256.png`, `/public/logo/256.png` (same donut copied)
- Favicon: generated from donut at 16px, 32px, 180px (apple-touch)
- App icon: 1024px for App Store/Play Store

### Logo Usage
- **Website header:** donut icon (40px) + wordmark (36px tall)
- **Mobile header:** donut as sidebar toggle (40px) + text wordmark centered
- **Sidebar (desktop):** donut (36px) + inverted wordmark (white on dark sidebar)
- **Footer:** donut (40px) + inverted wordmark + "Part of the Lineage HQ portfolio"
- **Favicon:** donut only

---

## Colour System

### Primary Palette
| Name | Hex | Usage |
|------|-----|-------|
| Teal (Primary) | `#0D9488` | CTAs, active states, links, accent |
| Navy | `#0F172A` | Sidebar background, headings, hero sections |
| Slate 900 | `#0F172A` | Body text on light backgrounds |
| Slate 50 | `#F8FAFC` | Page background (light mode) |
| White | `#FFFFFF` | Card backgrounds, content areas |

### Semantic Colours
| Name | Hex | Usage |
|------|-----|-------|
| Income Green | `#16A34A` | Revenue amounts, positive trends |
| Expense Red | `#EF4444` | Expense amounts, negative trends, alerts |
| Warning Amber | `#F59E0B` | GST owing, caution states |
| Info Blue | `#3B82F6` | Informational badges, links |
| Violet | `#8B5CF6` | AI/Ledge features, smart suggestions |

### Gradient
- **Hero accent:** `linear-gradient(90deg, #0F172A, #0D9488)` — 3px line at top of content
- **CTA buttons:** solid `#0D9488`, hover `#0F766E`

---

## Typography

### Font Stack
| Role | Font | Weight | Source |
|------|------|--------|--------|
| Headings | Plus Jakarta Sans | 700–800 | Google Fonts |
| Body | Inter | 400–600 | System / Google Fonts |
| Numbers/Money | JetBrains Mono | 500–700 | Google Fonts |

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page title | 24px (text-2xl) | 700 | 1.2 |
| Section heading | 18px | 600 | 1.3 |
| Card heading | 14px (text-sm) | 600 | 1.4 |
| Body | 14px | 400 | 1.5 |
| Small/meta | 12px | 400 | 1.5 |
| Tiny labels | 10px | 500 | 1.4 |
| Money amounts | 14–24px | 700 | 1.2 (tabular-nums) |

### Rules
- All financial amounts use `font-mono tabular-nums` (JetBrains Mono)
- Dates formatted as: `20 Mar 2026` (never ISO)
- Currency: AUD only ($ prefix, 2 decimal places)

---

## Component Library

### Cards
- Background: `bg-card` (white in light, dark in dark mode)
- Border: `border border-border` (1px, subtle grey)
- Radius: `rounded-xl` (12px)
- Shadow: none (border-only design)
- Padding: `p-5` desktop, `p-4` mobile

### KPI Stat Cards
- Coloured left border or top accent (3px)
- Icon in colour-matched circle
- Sparkline (60×24px SVG) bottom-right
- Staggered entrance animation (100ms delay between cards)

### Buttons
- Primary: `bg-teal-600 text-white rounded-lg px-5 py-2.5`
- Secondary: `border border-border rounded-lg`
- Destructive: `border-red-500/30 text-red-400`
- Min touch target: 44px height (Apple HIG)

### Modals
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Card: `rounded-2xl shadow-2xl max-w-lg`
- Close: X button top-right
- Actions: right-aligned, Cancel + Primary

### Mobile Header
- Fixed top, z-50, `bg-background/95 backdrop-blur-sm`
- Left: donut icon (menu toggle, 40px)
- Center: text wordmark (flex-1, min-h-44px tap target)
- Right: unsorted badge (if >0) + profile icon (User)

### Sidebar (Desktop)
- Dark theme: `bg-sidebar` (navy)
- Width: inset variant, collapsible to icon-only
- Sections: Upload → Overview → Accounting → Reports & Tax → Tools → Settings
- Active state: teal background + left border

### Floating Actions
- Bottom-right, 16px from edges
- AI chat button: teal gradient, sparkle icon
- FAB +: expands to 4 quick actions (Upload, Invoice, Expense, Contact)

---

## Page Inventory (Web App)

### Implemented & Live
| Page | Route | Status |
|------|-------|--------|
| Landing | `/` | ✅ Full marketing page |
| Auth/Login | `/enter` | ✅ Better Auth |
| Dashboard | `/dashboard` | ✅ KPIs, chart, categories, transactions, AI insight |
| Transactions | `/transactions` | ✅ List + detail view |
| Transaction Detail | `/transactions/[id]` | ✅ Mobile-responsive edit form |
| Unsorted (Receipt Inbox) | `/unsorted` | ✅ AI receipt scanning |
| Bank Feeds | `/bank-feeds` | ✅ AU bank connection wizard |
| Invoices List | `/invoices` | ✅ Status badges, filters |
| Invoice Create | `/invoices/create` | ✅ Xero-level line items, contact lookup |
| Contacts | `/contacts` | ✅ ABN lookup, Ledge AI auto-fill |
| Chart of Accounts | `/accounts` | ✅ 48 AU accounts, custom codes, collapsible groups |
| GST & BAS | `/gst` | ✅ BAS readiness indicator |
| Cash Flow | `/cashflow` | ✅ Forecast chart |
| Money Rules | `/money-rules` | ✅ Editable allocations, rule builder |
| Accountant Portal | `/accountant` | ✅ Partner program, client management |
| Ask Ledge AI | `/ask` | ✅ Chat interface |
| Import/Migrate | `/migrate` | ✅ Xero/MYOB/CSV migration wizard |
| Settings - General | `/settings` | ✅ AUD-locked, defaults |
| Settings - Profile | `/settings/profile` | ✅ Plan management |
| Settings - Business | `/settings/business` | ✅ 30+ fields (ABN, BSB, terms, invoice defaults) |
| Settings - Categories | `/settings/categories` | ✅ Visual colour picker |
| Settings - Projects | `/settings/projects` | ✅ Card-style with colours |
| Settings - Fields | `/settings/fields` | ✅ Standard + custom fields |
| Settings - Backups | `/settings/backups` | ✅ Data export |
| Settings - Data Management | `/settings/danger` | ✅ Account deletion |

---

## Tech Stack

### Web App
- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL) — ref: `dcemanhmabsjmkitskil`
- **ORM:** Prisma 6.6 with generated client
- **Auth:** Better Auth (email magic link)
- **Hosting:** Vercel — project: `ledgable`
- **Domain:** ledgable.co (Cloudflare DNS → Vercel)
- **Charts:** Recharts
- **Icons:** Lucide React
- **UI Components:** shadcn/ui (Radix primitives)
- **CSS:** Tailwind CSS v3

### Database (Prisma Models)
User, Session, Account, Verification, Setting, Category, Project, Field, File, Transaction, Currency, AppData, Progress, BankConnection, BankTransaction, GSTReturn, MoneyRule

### Environment Variables (Vercel)
- `DATABASE_URL` — Supabase direct connection (IPv4 enabled)
- `BETTER_AUTH_SECRET` — 32+ char secret
- `SELF_HOSTED_MODE` — `true`
- `BASE_URL` — `https://ledgable.co`

### GitHub
- Repo: `lineage007/ledgable`
- Auto-deploys on push to `main`
- Fork of: `vas3k/TaxHacker` (MIT license)

---

## Flutter App Plan

### Approach
1. Screenshot every web page at 430px mobile width
2. Build Flutter screens to match pixel-for-pixel
3. Same colour system, fonts (Google Fonts), spacing values
4. Side-by-side comparison before upload

### Flutter-Specific
- **Fonts:** Plus Jakarta Sans + Inter + JetBrains Mono (all on Google Fonts)
- **Colors:** Exact hex values from this document
- **Navigation:** Bottom nav (Dashboard, Transactions, Scan, Invoices, More)
- **Native features:** Camera for receipt scanning, biometric auth, push notifications
- **State management:** Riverpod or Provider
- **Backend:** Same Supabase instance as web app

### Bundle IDs (reserved)
- iOS: `co.ledgable.app`
- Android: `co.ledgable.app`

---

## Positioning & Copy

### Tagline
"AI does your books. You run your business."

### Value Props
1. **Money Rules** — only on Ledgable, no competitor has this (Profit First methodology)
2. **AI-first** — Ledge AI categorises, reconciles, forecasts automatically
3. **Australia-built** — GST, BAS, ABN lookup, AU bank feeds, ATO integration
4. **80% cheaper** — $19/mo vs Xero's $75/mo for equivalent features
5. **Privacy-first** — AU-hosted, your data never leaves the country

### Target Market
- Australian small businesses (sole traders, partnerships, small companies)
- Currently on Xero/MYOB and paying too much
- Want something simpler, cheaper, AI-powered
- Not accountants — business owners who want to spend less time on books

### Pricing
| Plan | Monthly | Annual (17% off) |
|------|---------|-------------------|
| Starter | $9/mo | $7.50/mo |
| Business | $19/mo | $16/mo |
| Pro | $39/mo | $33/mo |

### Competitor Comparison
| Feature | Ledgable | Xero | MYOB | QuickBooks |
|---------|----------|------|------|------------|
| Price | $19/mo | $75/mo | $60/mo | $55/mo |
| AI Categorisation | ✅ | ❌ | ❌ | Basic |
| Money Rules | ✅ | ❌ | ❌ | ❌ |
| AI Receipt Scanning | ✅ | Add-on | Add-on | ✅ |
| AU Bank Feeds | ✅ | ✅ | ✅ | ✅ |
| GST/BAS | ✅ | ✅ | ✅ | ✅ |
| ATO Lodgement | Planned | ✅ | ✅ | ✅ |

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Mar 21, 2026 | Donut icon selected | Gary chose from 10 AI-generated concepts |
| Mar 21, 2026 | Split wordmark (ledg/able) | Navy + teal treatment, Gary approved |
| Mar 21, 2026 | AUD-only currency | Simplify v1, multi-currency later |
| Mar 21, 2026 | AI Provider hidden from settings | We handle AI internally, users don't see it |
| Mar 21, 2026 | Categories/Fields/Projects → Advanced | Keep main settings clean |
| Mar 21, 2026 | Email forwarding for receipts | User gets unique @inbox.ledgable.co address |
| Mar 21, 2026 | Accountant Partner Program | $5/client/mo referral revenue |
| Mar 19, 2026 | Fork TaxHacker as foundation | MIT license, solid receipt scanning base |
| Mar 19, 2026 | Supabase for database | Consistent with other Lineage projects |

---

*This document is the single source of truth for all Ledgable brand and design decisions. Reference before any design work.*
