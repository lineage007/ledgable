import { getCurrentUser } from "@/lib/auth"
import { getSettings } from "@/models/settings"
import { Metadata } from "next"
import config from "@/lib/config"
import Link from "next/link"
import DashboardDropZoneWidget from "@/components/dashboard/drop-zone-widget"

export const metadata: Metadata = {
  title: "Dashboard — Ledgable",
  description: "Your financial command center",
}

export default async function Dashboard() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-7xl self-center">
      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Cash Position" 
          value="$0.00" 
          change="+0%" 
          icon="💰" 
          color="emerald" 
        />
        <StatCard 
          label="Outstanding Invoices" 
          value="$0.00" 
          change="0 overdue" 
          icon="📄" 
          color="blue" 
        />
        <StatCard 
          label="Upcoming Bills" 
          value="$0.00" 
          change="0 due this week" 
          icon="📋" 
          color="amber" 
        />
        <StatCard 
          label="Net Profit (MTD)" 
          value="$0.00" 
          change="+0% vs last month" 
          icon="📈" 
          color="teal" 
        />
      </div>

      {/* AI Insights */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">✨</div>
          <h3 className="font-semibold text-emerald-400">AI Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect your bank account to get personalized financial insights. Ledge AI will analyze your spending patterns, 
          forecast cash flow, and alert you to anomalies.
        </p>
        <Link href="/bank-feeds" className="text-sm text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
          Connect bank account →
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: P&L Summary */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Profit & Loss</h3>
            <div className="flex gap-2">
              <PeriodButton label="MTD" active />
              <PeriodButton label="QTD" />
              <PeriodButton label="YTD" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <p>Add transactions to see your P&L chart</p>
              <Link href="/transactions" className="text-emerald-400 text-sm mt-1 inline-block">
                Import transactions →
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Cashflow Forecast */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Cash Forecast</h3>
          <div className="space-y-4">
            <ForecastRow label="Today" amount="$0.00" />
            <ForecastRow label="30 days" amount="$0.00" />
            <ForecastRow label="60 days" amount="$0.00" />
            <ForecastRow label="90 days" amount="$0.00" />
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Link href="/cashflow" className="text-sm text-emerald-400 hover:text-emerald-300">
              View full forecast →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <Link href="/transactions" className="text-sm text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="text-center py-8 text-muted-foreground text-sm">
            <div className="text-3xl mb-2">🏦</div>
            <p>No transactions yet</p>
            <p className="text-xs mt-1">Connect a bank or upload receipts to get started</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction href="/invoices" icon="📄" label="New Invoice" />
            <QuickAction href="/bank-feeds" icon="🏦" label="Connect Bank" />
            <QuickAction href="/unsorted" icon="📸" label="Scan Receipt" />
            <QuickAction href="/gst" icon="🧮" label="BAS Report" />
            <QuickAction href="/import/csv" icon="📥" label="Import Data" />
            <QuickAction href="/money-rules" icon="⚙️" label="Money Rules" />
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <DashboardDropZoneWidget />
    </div>
  )
}

function StatCard({ label, value, change, icon, color }: { label: string; value: string; change: string; icon: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    teal: 'border-teal-500/20 bg-teal-500/5',
  }
  return (
    <div className={`rounded-xl border ${colors[color] || colors.emerald} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{change}</div>
    </div>
  )
}

function PeriodButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
      active ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted-foreground hover:text-foreground'
    }`}>
      {label}
    </button>
  )
}

function ForecastRow({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium">{amount}</span>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group">
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

export const dynamic = "force-dynamic"
