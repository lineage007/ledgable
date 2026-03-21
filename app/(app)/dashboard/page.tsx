import { getCurrentUser } from "@/lib/auth"
import { getSettings } from "@/models/settings"
import { getTransactions } from "@/models/transactions"
import { getCategories } from "@/models/categories"
import { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, Receipt, FileText,
  Landmark, Upload, Sparkles, ChevronRight, BarChart3, Clock,
  Plus, ArrowRightLeft, AlertCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard — Ledgable",
  description: "Your financial command center",
}

export default async function Dashboard() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)
  const { transactions } = await getTransactions(user.id)
  const categories = await getCategories(user.id)

  // Compute real stats from transactions (total is in cents)
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + (t.total || 0) / 100, 0)
  const expenses = transactions.filter(t => t.type !== "income").reduce((s, t) => s + Math.abs(t.total || 0) / 100, 0)
  const netProfit = income - expenses
  const gstCollected = income * 0.1
  const gstPaid = expenses * 0.1
  const gstOwing = gstCollected - gstPaid

  // Category breakdown
  const byCat = new Map<string, number>()
  transactions.forEach(t => {
    const cat = (t as any).category?.name || "Uncategorised"
    byCat.set(cat, (byCat.get(cat) || 0) + Math.abs((t.total || 0) / 100))
  })
  const topCategories = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxCat = topCategories[0]?.[1] || 1

  // Recent transactions
  const recent = transactions.slice(0, 8)

  // Date formatting
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  const fmtAud = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  const fmtAud2 = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n)

  return (
    <div className="flex flex-col gap-5 p-5 md:p-8 w-full max-w-[1400px] mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Financial overview as of {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/invoices/create" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
          <Link href="/unsorted" className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            <Upload className="h-4 w-4" />
            Scan Receipt
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Revenue"
          value={fmtAud(income)}
          sub="This period"
          trend="up"
          icon={<ArrowUpRight className="h-4 w-4" />}
          color="teal"
        />
        <KpiCard
          label="Expenses"
          value={fmtAud(expenses)}
          sub={`${transactions.filter(t => (t.total ?? 0) < 0).length} transactions`}
          trend="neutral"
          icon={<ArrowDownRight className="h-4 w-4" />}
          color="rose"
        />
        <KpiCard
          label="Net Profit"
          value={fmtAud(netProfit)}
          sub={income > 0 ? `${((netProfit / income) * 100).toFixed(0)}% margin` : "—"}
          trend={netProfit >= 0 ? "up" : "down"}
          icon={<TrendingUp className="h-4 w-4" />}
          color="emerald"
        />
        <KpiCard
          label="GST Owing"
          value={fmtAud2(gstOwing)}
          sub="Estimated BAS"
          trend="neutral"
          icon={<Receipt className="h-4 w-4" />}
          color="amber"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Spending by Category */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Spending by Category</h2>
            </div>
            <Link href="/transactions" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {topCategories.length > 0 ? topCategories.map(([cat, val]) => {
              const pct = (val / maxCat) * 100
              const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5", "bg-muted-foreground/30"]
              const idx = topCategories.findIndex(c => c[0] === cat)
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 truncate shrink-0">{cat}</span>
                  <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden relative">
                    <div
                      className={`h-full ${colors[idx] || colors[5]} rounded-md transition-all`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono font-medium text-foreground/70">
                      {fmtAud(val)}
                    </span>
                  </div>
                </div>
              )
            }) : (
              <EmptyState
                icon={<BarChart3 className="h-8 w-8" />}
                title="No transactions yet"
                description="Import transactions or scan receipts to see your spending breakdown"
                href="/unsorted"
                linkText="Upload a receipt"
              />
            )}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <QuickAction href="/invoices/create" icon={<FileText className="h-4 w-4" />} label="Create Invoice" desc="Bill a client" />
            <QuickAction href="/bank-feeds" icon={<Landmark className="h-4 w-4" />} label="Connect Bank" desc="Auto-import transactions" />
            <QuickAction href="/unsorted" icon={<Upload className="h-4 w-4" />} label="Scan Receipt" desc="AI-powered extraction" />
            <QuickAction href="/gst" icon={<Receipt className="h-4 w-4" />} label="BAS Report" desc="GST summary for ATO" />
            <QuickAction href="/ask" icon={<Sparkles className="h-4 w-4" />} label="Ask Ledge AI" desc="Natural language queries" />
            <QuickAction href="/money-rules" icon={<ArrowRightLeft className="h-4 w-4" />} label="Money Rules" desc="Budgeting envelopes" />
          </div>
        </div>
      </div>

      {/* Bottom: Recent Transactions */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Recent Transactions</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
              {transactions.length}
            </span>
          </div>
          <Link href="/transactions" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="border-t border-border">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left font-medium px-5 py-2.5">Date</th>
                  <th className="text-left font-medium px-3 py-2.5">Description</th>
                  <th className="text-left font-medium px-3 py-2.5 hidden sm:table-cell">Category</th>
                  <th className="text-right font-medium px-5 py-2.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t, i) => (
                  <tr key={t.id} className={`text-sm hover:bg-muted/50 transition-colors ${i < recent.length - 1 ? "border-b border-border/50" : ""}`}>
                    <td className="px-5 py-3 text-muted-foreground text-xs font-mono">
                      {fmt(t.issuedAt || t.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-sm truncate max-w-[300px]">{t.description || "—"}</div>
                      {t.merchant && <div className="text-xs text-muted-foreground truncate">{t.merchant}</div>}
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      {(t as any).category ? (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {(t as any).category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className={`px-5 py-3 text-right font-mono text-sm font-medium ${((t.total || 0) / 100) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {((t.total || 0) / 100) >= 0 ? "+" : ""}{fmtAud2(((t.total || 0) / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 pt-0">
            <EmptyState
              icon={<ArrowRightLeft className="h-8 w-8" />}
              title="No transactions yet"
              description="Start by connecting a bank account or uploading receipts"
              href="/bank-feeds"
              linkText="Connect bank"
            />
          </div>
        )}
      </div>

      {/* Ledge AI Banner */}
      {!settings?.openai_api_key && !settings?.google_api_key && (
        <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Set up Ledge AI</p>
            <p className="text-xs text-muted-foreground">Add a Gemini or OpenAI key in Settings to enable AI receipt scanning and financial insights.</p>
          </div>
          <Link href="/settings/llm" className="text-sm text-primary font-medium hover:underline shrink-0">
            Settings →
          </Link>
        </div>
      )}
    </div>
  )
}

function KpiCard({ label, value, sub, trend, icon, color }: {
  label: string; value: string; sub: string; trend: "up" | "down" | "neutral"; icon: React.ReactNode; color: string
}) {
  const borderColor: Record<string, string> = {
    teal: "border-l-primary",
    rose: "border-l-rose-500",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
  }
  return (
    <div className={`bg-card border border-border ${borderColor[color] || ""} border-l-[3px] rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <div className="text-xl font-bold tracking-tight font-mono">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  )
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto group-hover:text-muted-foreground transition-colors" />
    </Link>
  )
}

function EmptyState({ icon, title, description, href, linkText }: {
  icon: React.ReactNode; title: string; description: string; href: string; linkText: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-muted-foreground/30 mb-3">{icon}</div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">{description}</p>
      <Link href={href} className="text-xs text-primary font-medium mt-3 hover:underline">
        {linkText} →
      </Link>
    </div>
  )
}

export const dynamic = "force-dynamic"
