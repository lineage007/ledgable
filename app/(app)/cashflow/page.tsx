import { TrendingUp, TrendingDown, CalendarDays, Sparkles, ArrowRight } from "lucide-react"

const MONTHS = [
  { month: "Oct", income: 38200, expense: 28100 },
  { month: "Nov", income: 41500, expense: 31200 },
  { month: "Dec", income: 35800, expense: 29800 },
  { month: "Jan", income: 42500, expense: 30500 },
  { month: "Feb", income: 39200, expense: 32100 },
  { month: "Mar", income: 44100, expense: 33400 },
]

const UPCOMING = [
  { date: "Mar 28", desc: "BAS Q3 Payment Due", amount: 2437.50, type: "tax", icon: "🏛️" },
  { date: "Apr 1", desc: "Office Lease — Quarter", amount: 8400.00, type: "expense", icon: "🏢" },
  { date: "Apr 3", desc: "Client Invoice — Acme Corp", amount: 11000.00, type: "income", icon: "📥" },
  { date: "Apr 7", desc: "Staff Payroll", amount: 12800.00, type: "expense", icon: "👥" },
  { date: "Apr 15", desc: "Client Invoice — Beta Ltd", amount: 6600.00, type: "income", icon: "📥" },
]

function BarChart({ data }: { data: typeof MONTHS }) {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]))
  return (
    <div className="flex items-end gap-3 h-48 mt-4">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-1 w-full justify-center" style={{ height: "160px" }}>
            <div
              className="w-5 rounded-t-md transition-all duration-500"
              style={{ height: `${(d.income / maxVal) * 140}px`, background: "#0D9488" }}
              title={`Income: $${d.income.toLocaleString()}`}
            />
            <div
              className="w-5 rounded-t-md transition-all duration-500"
              style={{ height: `${(d.expense / maxVal) * 140}px`, background: "#F87171" }}
              title={`Expense: $${d.expense.toLocaleString()}`}
            />
          </div>
          <span className="text-xs text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

export default function CashflowPage() {
  const currentBalance = 51331.55
  const projected30 = currentBalance + 17600 - 21200
  const projected60 = projected30 + 15400 - 19800
  const projected90 = projected60 + 18200 - 20100

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Cashflow
        </h1>
        <p className="text-slate-500 text-sm mt-1">Forecast based on your real transaction history</p>
      </div>

      {/* Projection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today", val: currentBalance, trend: null },
          { label: "30 days", val: projected30, trend: projected30 > currentBalance },
          { label: "60 days", val: projected60, trend: projected60 > currentBalance },
          { label: "90 days", val: projected90, trend: projected90 > currentBalance },
        ].map((p, i) => (
          <div key={p.label} className={`rounded-2xl p-5 border shadow-sm ${i === 0 ? "bg-teal-900 border-teal-800 text-white" : "bg-white border-slate-200"}`}>
            <div className={`text-xs font-medium mb-1 ${i === 0 ? "text-teal-300" : "text-slate-400"}`}>{p.label}</div>
            <div className={`text-2xl font-extrabold ${i === 0 ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Plus Jakarta Sans'" }}>
              ${p.val.toLocaleString("en-AU", { maximumFractionDigits: 0 })}
            </div>
            {p.trend !== null && (
              <div className={`flex items-center gap-1 text-xs mt-1 ${p.trend ? "text-emerald-500" : "text-red-500"}`}>
                {p.trend ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {p.trend ? "Growing" : "Declining"}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900">Income vs Expenses</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-teal-600" /> Income</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-400" /> Expenses</div>
          </div>
        </div>
        <BarChart data={MONTHS} />
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Upcoming Cash Movements</h3>
        </div>
        {UPCOMING.map((item, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">{item.icon}</div>
              <div>
                <div className="text-sm font-medium text-slate-900">{item.desc}</div>
                <div className="text-xs text-slate-400">{item.date}</div>
              </div>
            </div>
            <div className={`text-sm font-bold ${item.type === "income" ? "text-teal-600" : item.type === "tax" ? "text-amber-600" : "text-slate-900"}`}>
              {item.type === "income" ? "+" : "-"}${item.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-white">
          <div className="font-bold mb-1">Cashflow Insight</div>
          <p className="text-teal-200 text-sm leading-relaxed">
            Based on your last 6 months, March is historically your strongest revenue month (+16% above average).
            Your BAS payment of $2,437.50 is due March 28 — you have sufficient funds.
            Projected April balance is healthy at ${projected30.toLocaleString("en-AU", { maximumFractionDigits: 0 })}.
          </p>
        </div>
      </div>
    </div>
  )
}
