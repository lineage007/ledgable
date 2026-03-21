import { getCurrentUser } from "@/lib/auth"
import { getSettings } from "@/models/settings"
import { getTransactions } from "@/models/transactions"
import { getCategories } from "@/models/categories"
import { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, Receipt, FileText,
  Landmark, Upload, Sparkles, ChevronRight, BarChart3, Clock,
  Plus, ArrowRightLeft, Zap, CheckCircle2, Circle,
  MessageSquare, PiggyBank, Activity
} from "lucide-react"
import { DashboardCharts } from "./charts"

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

  // Category breakdown with colours
  const catColors = ["#0D9488", "#F59E0B", "#6366F1", "#EC4899", "#3B82F6", "#8B5CF6", "#EF4444", "#10B981"]
  const byCat = new Map<string, number>()
  transactions.forEach(t => {
    const cat = (t as any).category?.name || "Uncategorised"
    byCat.set(cat, (byCat.get(cat) || 0) + Math.abs((t.total || 0) / 100))
  })
  const topCategories = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const totalSpending = topCategories.reduce((s, [, v]) => s + v, 0)
  const donutData = topCategories.map(([name, value], i) => ({
    name,
    value,
    color: catColors[i % catColors.length],
    pct: totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(0) : "0"
  }))

  // Monthly income vs expense data for chart (last 6 months)
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const month = d.toLocaleDateString("en-AU", { month: "short" })
    const monthTx = transactions.filter(t => {
      const td = new Date(t.issuedAt || t.createdAt)
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
    })
    const inc = monthTx.filter(t => t.type === "income").reduce((s, t) => s + (t.total || 0) / 100, 0)
    const exp = monthTx.filter(t => t.type !== "income").reduce((s, t) => s + Math.abs(t.total || 0) / 100, 0)
    return { month, income: inc, expenses: exp }
  })

  // Recent transactions
  const recent = transactions.slice(0, 6)

  // Date formatting
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  const fmtAud = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  const fmtAud2 = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n)

  // Onboarding progress
  const hasTransactions = transactions.length > 0
  const hasBank = false // TODO: check bank connections
  const hasInvoice = false // TODO: check invoices
  const hasRules = false // TODO: check money rules
  const setupSteps = [
    { label: "Upload first receipt", done: hasTransactions, href: "/unsorted" },
    { label: "Connect bank account", done: hasBank, href: "/bank-feeds" },
    { label: "Send first invoice", done: hasInvoice, href: "/invoices/create" },
    { label: "Set up Money Rules", done: hasRules, href: "/money-rules" },
  ]
  const setupDone = setupSteps.filter(s => s.done).length
  const setupTotal = setupSteps.length
  const showOnboarding = setupDone < setupTotal

  // Business Health Score (simple heuristic)
  let healthScore = 50
  if (netProfit > 0) healthScore += 15
  if (hasTransactions) healthScore += 10
  if (gstOwing >= 0 && gstOwing < 5000) healthScore += 10
  if (income > expenses) healthScore += 15
  healthScore = Math.min(healthScore, 100)

  return (
    <div className="flex flex-col gap-5 p-4 md:gap-6 md:p-8 w-full max-w-[1400px] mx-auto pb-32 md:pb-8">

      {/* Page Header — Greeting style on mobile */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-[22px] font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            <span className="hidden md:inline">Dashboard</span>
            <span className="md:hidden">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} 👋</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Period selector — desktop */}
          <div className="hidden md:flex items-center bg-muted rounded-lg p-0.5 text-xs font-medium">
            <button className="px-3 py-1.5 rounded-md bg-card text-foreground shadow-sm">This Month</button>
            <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">Quarter</button>
            <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">FY</button>
          </div>
          <Link href="/invoices/create" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Mobile Quick Actions — 2x2 grid */}
      <div className="grid grid-cols-2 gap-2.5 md:hidden">
        {[
          { href: "/unsorted", icon: Upload, label: "Scan Receipt", color: "bg-violet-500" },
          { href: "/invoices/create", icon: FileText, label: "New Invoice", color: "bg-emerald-500" },
          { href: "/bank-feeds", icon: Landmark, label: "Bank Feeds", color: "bg-blue-500" },
          { href: "/ask", icon: Sparkles, label: "Ask Ledge", color: "bg-primary" },
        ].map(a => (
          <Link key={a.label} href={a.href}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-card border border-border hover:shadow-md transition-all active:scale-[0.97]">
            <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
              <a.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Onboarding Checklist (new users) */}
      {showOnboarding && (
        <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/15 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Get started with Ledgable</span>
            </div>
            <span className="text-xs font-mono font-medium text-primary">{setupDone}/{setupTotal}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(setupDone / setupTotal) * 100}%` }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {setupSteps.map(step => (
              <Link key={step.label} href={step.href}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition-colors ${step.done ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-card border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"}`}>
                {step.done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />}
                <span className="truncate">{step.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Hero Net Profit — mobile-first visual impact */}
      <div className="md:hidden">
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative">
            <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">Net Profit</div>
            <div className="text-3xl font-bold font-mono tabular-nums">{fmtAud(netProfit)}</div>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-emerald-400 font-medium">{income > 0 ? `${((netProfit / income) * 100).toFixed(0)}% margin` : "—"}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50">{new Date().toLocaleDateString("en-AU", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards — Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard label="Revenue" value={fmtAud(income)} trend="+12%" trendUp={true} icon={<ArrowUpRight className="h-4 w-4" />} color="teal" sub="vs last month" />
        <KpiCard label="Expenses" value={fmtAud(expenses)} trend={`${transactions.filter(t => (t.total ?? 0) < 0).length} txns`} trendUp={false} icon={<ArrowDownRight className="h-4 w-4" />} color="rose" sub="this period" />
        <div className="hidden md:block"><KpiCard label="Net Profit" value={fmtAud(netProfit)} trend={income > 0 ? `${((netProfit / income) * 100).toFixed(0)}% margin` : "—"} trendUp={netProfit >= 0} icon={<TrendingUp className="h-4 w-4" />} color="emerald" sub="income − expenses" /></div>
        <KpiCard label="GST Owing" value={fmtAud2(gstOwing)} trend="Due 28 Apr" trendUp={false} icon={<Receipt className="h-4 w-4" />} color="amber" sub="estimated BAS Q3" />
      </div>

      {/* Main Grid — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Income vs Expenses Area Chart — hero visual */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-5 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Income vs Expenses</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" />Expenses</span>
            </div>
          </div>
          <div className="px-2 pb-3" style={{ height: "280px" }}>
            <DashboardCharts type="area" data={monthlyData} />
          </div>
        </div>

        {/* Business Health + Spending Donut */}
        <div className="flex flex-col gap-5">
          {/* Health Score */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm">Business Health</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-muted" />
                  <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3"
                    className={healthScore >= 70 ? "stroke-emerald-500" : healthScore >= 40 ? "stroke-amber-500" : "stroke-rose-500"}
                    strokeDasharray={`${healthScore} ${100 - healthScore}`}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono">{healthScore}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Needs Attention" : "At Risk"}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Based on profit, cash position & tax compliance</p>
              </div>
            </div>
          </div>

          {/* Spending Donut */}
          <div className="bg-card border border-border rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-sm">Spending</h2>
              </div>
              <Link href="/transactions" className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5">
                All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {donutData.length > 0 ? (
              <div className="flex items-center gap-4">
                <div style={{ width: "100px", height: "100px" }} className="shrink-0">
                  <DashboardCharts type="donut" data={donutData} />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  {donutData.slice(0, 5).map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-[11px]">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="truncate text-muted-foreground flex-1">{d.name}</span>
                      <span className="font-mono font-medium text-foreground shrink-0">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No spending data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Recent Transactions</h2>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono font-medium">{transactions.length}</span>
            </div>
            <Link href="/transactions" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className="border-t border-border">
              {recent.map((t, i) => {
                const amt = (t.total || 0) / 100
                const isIncome = t.type === "income"
                return (
                  <div key={t.id} className={`flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors ${i < recent.length - 1 ? "border-b border-border/40" : ""}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {isIncome ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.description || t.merchant || "Transaction"}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {fmt(t.issuedAt || t.createdAt)}
                        {(t as any).category && <> · <span className="text-foreground/60">{(t as any).category.name}</span></>}
                      </div>
                    </div>
                    <span className={`font-mono text-sm font-semibold shrink-0 tabular-nums ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {isIncome ? "+" : "−"}{fmtAud2(Math.abs(amt))}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={<ArrowRightLeft className="h-10 w-10" />}
                title="No transactions yet"
                description="Start by connecting a bank account or uploading a receipt. Ledge AI will categorise everything automatically."
                href="/unsorted"
                linkText="Upload your first receipt"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Actions
          </h2>
          <div className="space-y-1.5">
            <QuickAction href="/invoices/create" icon={<FileText className="h-4 w-4" />} label="Create Invoice" desc="Bill a client" />
            <QuickAction href="/bank-feeds" icon={<Landmark className="h-4 w-4" />} label="Connect Bank" desc="Auto-import transactions" />
            <QuickAction href="/unsorted" icon={<Upload className="h-4 w-4" />} label="Scan Receipt" desc="AI-powered extraction" />
            <QuickAction href="/money-rules" icon={<PiggyBank className="h-4 w-4" />} label="Money Rules" desc="Profit First budgeting" />
          </div>

          {/* AI Insight */}
          <div className="mt-5 pt-4 border-t border-border">
            <Link href="/ask" className="group block p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 hover:border-primary/25 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Ledge AI Insight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {netProfit > 0
                  ? `Your profit margin is ${income > 0 ? ((netProfit / income) * 100).toFixed(0) : 0}%. Ask me how to optimise your tax position before EOFY.`
                  : "Upload some transactions and I'll give you instant insights on your spending patterns."
                }
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Components ──

function KpiCard({ label, value, trend, trendUp, icon, color, sub }: {
  label: string; value: string; trend: string; trendUp: boolean; icon: React.ReactNode; color: string; sub: string
}) {
  const accents: Record<string, { border: string; bg: string; text: string }> = {
    teal:    { border: "border-l-primary",       bg: "bg-primary/8",    text: "text-primary" },
    rose:    { border: "border-l-rose-500",      bg: "bg-rose-500/8",   text: "text-rose-500" },
    emerald: { border: "border-l-emerald-500",   bg: "bg-emerald-500/8", text: "text-emerald-500" },
    amber:   { border: "border-l-amber-500",     bg: "bg-amber-500/8",  text: "text-amber-500" },
  }
  const a = accents[color] || accents.teal
  return (
    <div className={`bg-card border border-border ${a.border} border-l-[3px] rounded-xl p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`h-7 w-7 rounded-lg ${a.bg} flex items-center justify-center ${a.text}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight font-mono tabular-nums">{value}</div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-[11px] font-medium ${trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{trend}</span>
        <span className="text-[10px] text-muted-foreground/60">{sub}</span>
      </div>
    </div>
  )
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors group">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground transition-colors" />
    </Link>
  )
}

function EmptyState({ icon, title, description, href, linkText }: {
  icon: React.ReactNode; title: string; description: string; href: string; linkText: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 mb-4">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px] leading-relaxed">{description}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
        {linkText}
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

export const dynamic = "force-dynamic"
