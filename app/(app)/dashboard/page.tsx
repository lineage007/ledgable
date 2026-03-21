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

  // ── Stats ──
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + (t.total || 0) / 100, 0)
  const expenses = transactions.filter(t => t.type !== "income").reduce((s, t) => s + Math.abs(t.total || 0) / 100, 0)
  const netProfit = income - expenses
  const gstCollected = income * 0.1
  const gstPaid = expenses * 0.1
  const gstOwing = gstCollected - gstPaid
  const profitMargin = income > 0 ? ((netProfit / income) * 100).toFixed(0) : "0"

  // ── Category breakdown ──
  const catColors = ["#0D9488", "#F59E0B", "#6366F1", "#EC4899", "#3B82F6", "#8B5CF6", "#EF4444", "#10B981"]
  const byCat = new Map<string, number>()
  transactions.forEach(t => {
    const cat = (t as any).category?.name || "Uncategorised"
    byCat.set(cat, (byCat.get(cat) || 0) + Math.abs((t.total || 0) / 100))
  })
  const topCategories = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const totalSpending = topCategories.reduce((s, [, v]) => s + v, 0)
  const donutData = topCategories.map(([name, value], i) => ({
    name, value,
    color: catColors[i % catColors.length],
    pct: totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(0) : "0"
  }))

  // ── Monthly data (last 6 months) ──
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

  // ── Sparkline data (monthly totals for sparklines) ──
  const sparkIncome = monthlyData.map(m => m.income)
  const sparkExpenses = monthlyData.map(m => m.expenses)
  const sparkProfit = monthlyData.map(m => m.income - m.expenses)
  const sparkGst = monthlyData.map(m => (m.income - m.expenses) * 0.1)

  // ── Recent transactions ──
  const recent = transactions.slice(0, 8)
  const recentMobile = transactions.slice(0, 3)

  // ── Formatters ──
  const fmt = (d: Date | string) => new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short" })
  const fmtAud = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
  const fmtAud2 = (n: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n)

  // ── Onboarding ──
  const hasTransactions = transactions.length > 0
  const setupSteps = [
    { label: "Upload first receipt", done: hasTransactions, href: "/unsorted" },
    { label: "Connect bank account", done: false, href: "/bank-feeds" },
    { label: "Send first invoice", done: false, href: "/invoices/create" },
    { label: "Set up Money Rules", done: false, href: "/money-rules" },
  ]
  const setupDone = setupSteps.filter(s => s.done).length
  const showOnboarding = setupDone < setupSteps.length

  // ── Health Score ──
  let healthScore = 50
  if (netProfit > 0) healthScore += 15
  if (hasTransactions) healthScore += 10
  if (gstOwing >= 0 && gstOwing < 5000) healthScore += 10
  if (income > expenses) healthScore += 15
  healthScore = Math.min(healthScore, 100)

  // ── Days until BAS ──
  const nextBas = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3 + 1) * 3, 28)
  const basDays = Math.max(0, Math.ceil((nextBas.getTime() - now.getTime()) / 86400000))

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-32 md:pb-8">

      {/* ═══ Gradient Accent Line ═══ */}
      <div className="h-[3px] w-full rounded-t-lg" style={{ background: "linear-gradient(90deg, #0D47A1 0%, #00BFA5 100%)" }} />

      <div className="flex flex-col gap-5 p-3 md:gap-6 md:p-6"
        style={{ ["--animate-delay" as string]: "0ms" }}>

        {/* ═══ Header ═══ */}
        <div className="flex items-start justify-between gap-3 animate-fadeIn" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-tight" style={{ letterSpacing: "-0.02em", color: "#1A1A2E" }}>
              <span className="hidden md:inline">Dashboard</span>
              <span className="md:hidden">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"} 👋</span>
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center bg-[#F1F3F5] rounded-lg p-0.5 text-xs font-medium">
              <button className="px-3 py-1.5 rounded-md bg-white text-[#1A1A2E] shadow-sm">This Month</button>
              <button className="px-3 py-1.5 rounded-md text-[#6B7280] hover:text-[#1A1A2E] transition-colors">Quarter</button>
              <button className="px-3 py-1.5 rounded-md text-[#6B7280] hover:text-[#1A1A2E] transition-colors">FY</button>
            </div>
            <Link href="/invoices/create" className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#0D9488] text-white rounded-lg text-sm font-semibold hover:bg-[#0F766E] transition-colors">
              <Plus className="h-4 w-4" /> New Invoice
            </Link>
          </div>
        </div>

        {/* ═══ Mobile Quick Actions — 2×2 ═══ */}
        <div className="grid grid-cols-2 gap-2.5 md:hidden animate-fadeIn" style={{ animationDelay: "50ms" }}>
          {[
            { href: "/unsorted", icon: Upload, label: "Scan Receipt", color: "#8B5CF6" },
            { href: "/invoices/create", icon: FileText, label: "New Invoice", color: "#10B981" },
            { href: "/bank-feeds", icon: Landmark, label: "Bank Feeds", color: "#3B82F6" },
            { href: "/ask", icon: Sparkles, label: "Ask Ledge", color: "#0D9488" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white border border-[#E5E7EB] hover:shadow-md transition-all active:scale-[0.97]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: a.color }}>
                <a.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] font-medium text-[#1A1A2E]">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ═══ Onboarding ═══ */}
        {showOnboarding && (
          <div className="bg-gradient-to-r from-[#0D9488]/5 via-transparent to-transparent border border-[#0D9488]/15 rounded-xl p-5 animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#0D9488]" />
                <span className="text-sm font-semibold text-[#1A1A2E]">Get started with Ledgable</span>
              </div>
              <span className="text-xs font-mono font-medium text-[#0D9488]">{setupDone}/{setupSteps.length}</span>
            </div>
            <div className="h-1.5 bg-[#F1F3F5] rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-[#0D9488] rounded-full transition-all" style={{ width: `${(setupDone / setupSteps.length) * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {setupSteps.map(step => (
                <Link key={step.label} href={step.href}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition-colors ${step.done ? "bg-emerald-50 text-emerald-700" : "bg-white border border-[#E5E7EB] hover:border-[#0D9488]/30 text-[#6B7280] hover:text-[#1A1A2E]"}`}
                  style={{ boxShadow: step.done ? "none" : "0 1px 2px rgba(0,0,0,0.03)" }}>
                  {step.done ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Circle className="h-3.5 w-3.5 text-[#9CA3AF]/30 shrink-0" />}
                  <span className="truncate">{step.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ KPI Cards — 2×2 mobile, 4-col desktop ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-fadeIn" style={{ animationDelay: "150ms" }}>
          <KpiCard label="Revenue" value={fmtAud(income)} trend="+12%" trendUp accent="#16A34A" sub="vs last month" spark={sparkIncome} />
          <KpiCard label="Expenses" value={fmtAud(expenses)} trend={`${transactions.filter(t => (t.total ?? 0) < 0).length} txns`} trendUp={false} accent="#EF4444" sub="this period" spark={sparkExpenses} />
          <KpiCard label="Net Profit" value={fmtAud(netProfit)} trend={`${profitMargin}% margin`} trendUp={netProfit >= 0} accent="#3B82F6" sub="income − expenses" spark={sparkProfit} />
          <KpiCard label="GST Owing" value={fmtAud2(gstOwing)} trend={`Due in ${basDays}d`} trendUp={false} accent="#F59E0B" sub="estimated BAS" spark={sparkGst} />
        </div>

        {/* ═══ Revenue vs Expenses — Hero Chart ═══ */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden animate-fadeIn hover:shadow-md transition-shadow"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", animationDelay: "200ms" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#6B7280]" />
              <h2 className="text-[15px] font-semibold text-[#1A1A2E]" style={{ letterSpacing: "-0.01em" }}>Revenue vs Expenses</h2>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#16A34A]" />Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#EF4444]" />Expenses</span>
            </div>
          </div>
          <div className="px-2 pb-3 h-[160px] md:h-[220px]">
            <DashboardCharts type="area" data={monthlyData} />
          </div>
        </div>

        {/* ═══ Main Grid: Spending (1fr) + Transactions (2fr) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn" style={{ animationDelay: "250ms" }}>

          {/* Spending Donut */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#6B7280]" />
                <h2 className="text-[15px] font-semibold text-[#1A1A2E]" style={{ letterSpacing: "-0.01em" }}>Spending</h2>
              </div>
              <Link href="/transactions" className="text-[11px] font-medium text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-0.5 transition-colors">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {donutData.length > 0 ? (
              <>
                <div className="flex justify-center mb-4" style={{ height: "120px" }}>
                  <DashboardCharts type="donut" data={donutData} />
                </div>
                <div className="space-y-2">
                  {donutData.slice(0, 5).map(d => (
                    <div key={d.name} className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="flex-1 truncate text-sm text-[#1A1A2E]">{d.name}</span>
                      <span className="font-mono text-sm font-semibold text-[#1A1A2E] tabular-nums shrink-0">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <BarChart3 className="h-10 w-10 text-[#9CA3AF]/30 mb-3" />
                <p className="text-sm font-medium text-[#1A1A2E]">No spending data</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Upload receipts to see your breakdown</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#6B7280]" />
                <h2 className="text-[15px] font-semibold text-[#1A1A2E]" style={{ letterSpacing: "-0.01em" }}>Recent Transactions</h2>
                <span className="text-[10px] font-mono font-semibold text-[#6B7280] bg-[#F1F3F5] px-2 py-0.5 rounded-full">{transactions.length}</span>
              </div>
              <Link href="/transactions" className="text-[11px] font-medium text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-0.5 transition-colors">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Desktop table header */}
            <div className="hidden md:flex items-center px-5 py-2 border-t border-b border-[#F1F3F5] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              <span className="flex-1">Description</span>
              <span className="w-24 text-center">Date</span>
              <span className="w-28">Category</span>
              <span className="w-24 text-right">Amount</span>
            </div>

            {recent.length > 0 ? (
              <>
                {/* Desktop rows */}
                <div className="hidden md:block">
                  {recent.map((t, i) => {
                    const amt = (t.total || 0) / 100
                    const isIncome = t.type === "income"
                    const catName = (t as any).category?.name
                    return (
                      <Link key={t.id} href={`/transactions/${t.id}`}
                        className={`flex items-center px-5 py-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer ${i < recent.length - 1 ? "border-b border-[#F1F3F5]" : ""}`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-[#F1F3F5] text-[#6B7280]"}`}>
                            {isIncome ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </div>
                          <span className="text-sm font-medium text-[#1A1A2E] truncate">{t.description || t.merchant || "Transaction"}</span>
                        </div>
                        <span className="w-24 text-center text-sm text-[#6B7280]">{fmt(t.issuedAt || t.createdAt)}</span>
                        <span className="w-28">
                          {catName && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F3F5] text-[#6B7280]">{catName}</span>}
                        </span>
                        <span className={`w-24 text-right font-mono text-sm font-semibold tabular-nums ${isIncome ? "text-[#16A34A]" : "text-[#1A1A2E]"}`}>
                          {isIncome ? "+" : "−"}{fmtAud2(Math.abs(amt))}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile card rows */}
                <div className="md:hidden border-t border-[#F1F3F5]">
                  {recentMobile.map((t, i) => {
                    const amt = (t.total || 0) / 100
                    const isIncome = t.type === "income"
                    const catName = (t as any).category?.name
                    return (
                      <Link key={t.id} href={`/transactions/${t.id}`}
                        className={`flex flex-col px-4 py-3 active:bg-[#F9FAFB] transition-colors ${i < recentMobile.length - 1 ? "border-b border-[#F1F3F5]" : ""}`}
                        style={{ minHeight: "52px" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#1A1A2E] truncate flex-1 mr-3">{t.description || t.merchant || "Transaction"}</span>
                          <span className={`font-mono text-sm font-semibold tabular-nums shrink-0 ${isIncome ? "text-[#16A34A]" : "text-[#1A1A2E]"}`}>
                            {isIncome ? "+" : "−"}{fmtAud2(Math.abs(amt))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#6B7280]">{fmt(t.issuedAt || t.createdAt)}</span>
                          {catName && (
                            <>
                              <span className="text-[#9CA3AF]">·</span>
                              <span className="text-xs text-[#6B7280]">{catName}</span>
                            </>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                  <Link href="/transactions" className="flex items-center justify-center gap-1 py-3 text-xs font-medium text-[#3B82F6] hover:text-[#2563EB] border-t border-[#F1F3F5]">
                    See all transactions <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-8">
                <EmptyState
                  icon={<ArrowRightLeft className="h-10 w-10" />}
                  title="No transactions yet"
                  description="Start by uploading a receipt or connecting a bank account"
                  href="/unsorted"
                  linkText="Upload your first receipt"
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══ Bottom: Quick Actions + AI Insight ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn" style={{ animationDelay: "300ms" }}>

          {/* Quick Actions — 3 primary */}
          <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 className="text-[15px] font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2" style={{ letterSpacing: "-0.01em" }}>
              <Sparkles className="h-4 w-4 text-[#0D9488]" /> Quick Actions
            </h2>
            <div className="space-y-1.5">
              <QuickAction href="/invoices/create" icon={<FileText className="h-4 w-4" />} label="Create Invoice" desc="Bill a client" />
              <QuickAction href="/bank-feeds" icon={<Landmark className="h-4 w-4" />} label="Connect Bank" desc="Auto-import transactions" />
              <QuickAction href="/unsorted" icon={<Upload className="h-4 w-4" />} label="Scan Receipt" desc="AI-powered extraction" />
            </div>
          </div>

          {/* Ledge AI Insight — the positive card */}
          <div className="md:col-span-2 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)", border: "1px solid #BBF7D0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-[#16A34A]/10 flex items-center justify-center">
                  <MessageSquare className="h-3.5 w-3.5 text-[#16A34A]" />
                </div>
                <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">Ledge AI is watching your books</span>
              </div>
              <p className="text-sm text-[#1A1A2E] leading-relaxed mb-4">
                {netProfit > 0
                  ? `Your BAS is due in ${basDays} days. You have a healthy profit margin of ${profitMargin}%. Consider setting aside ${fmtAud(gstOwing)} for your next BAS payment.`
                  : "Upload your transactions and I'll monitor your cash flow, flag overdue invoices, and remind you before BAS deadlines. I work in the background so you don't have to think about it."
                }
              </p>
              <Link href="/ask" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16A34A] text-white rounded-lg text-xs font-semibold hover:bg-[#15803D] transition-colors">
                Ask Ledge <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out both;
        }
      `}</style>
    </div>
  )
}

// ══════════════════════════════════════════
// ── KPI Card with Sparkline & Top Border ──
// ══════════════════════════════════════════

function KpiCard({ label, value, trend, trendUp, accent, sub, spark }: {
  label: string; value: string; trend: string; trendUp: boolean; accent: string; sub: string; spark: number[]
}) {
  // Build sparkline SVG path
  const max = Math.max(...spark, 1)
  const min = Math.min(...spark, 0)
  const range = max - min || 1
  const w = 60, h = 24
  const points = spark.map((v, i) => {
    const x = (i / (spark.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(" ")

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl relative overflow-hidden group hover:shadow-md transition-all"
      style={{ borderTop: `3px solid ${accent}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>
      <div className="p-4 md:p-5 md:pb-4 flex flex-col justify-between" style={{ minHeight: "120px" }}>
        {/* Top row: label + trend */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider" style={{ letterSpacing: "0.05em", fontSize: "11px" }}>{label}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-[#F1F3F5] text-[#6B7280]"}`}>
            {trend}
          </span>
        </div>

        {/* Value */}
        <div className="text-[22px] md:text-[28px] font-bold leading-none tabular-nums" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace", color: "#1A1A2E" }}>
          {value}
        </div>

        {/* Meta + sparkline row */}
        <div className="flex items-end justify-between mt-2">
          <span className="text-xs text-[#9CA3AF]" style={{ minHeight: "16px" }}>{sub}</span>
          {/* Sparkline */}
          <svg width={w} height={h} className="shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
            <polyline fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════
// ── Quick Action Row ──
// ══════════════════════════════════

function QuickAction({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
      <div className="h-9 w-9 rounded-lg bg-[#F1F3F5] flex items-center justify-center text-[#6B7280] group-hover:bg-[#0D9488]/10 group-hover:text-[#0D9488] transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-[#1A1A2E]">{label}</div>
        <div className="text-[11px] text-[#9CA3AF]">{desc}</div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-[#9CA3AF]/30 group-hover:text-[#6B7280] transition-colors" />
    </Link>
  )
}

// ══════════════════════════════════
// ── Empty State ──
// ══════════════════════════════════

function EmptyState({ icon, title, description, href, linkText }: {
  icon: React.ReactNode; title: string; description: string; href: string; linkText: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="h-16 w-16 rounded-2xl bg-[#F1F3F5] flex items-center justify-center text-[#9CA3AF]/30 mb-4">{icon}</div>
      <p className="text-sm font-medium text-[#1A1A2E]">{title}</p>
      <p className="text-xs text-[#9CA3AF] mt-1.5 max-w-[280px] leading-relaxed">{description}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D9488] text-white rounded-lg text-xs font-semibold hover:bg-[#0F766E] transition-colors">
        {linkText} <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

export const dynamic = "force-dynamic"
