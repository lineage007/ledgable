"use client"

import { useState } from "react"
import { Plus, Sparkles, TrendingUp, AlertTriangle } from "lucide-react"

type Rule = { id: string; name: string; pct: number; actual: number; color: string; icon: string }

const INITIAL_RULES: Rule[] = [
  { id: "1", name: "Operating Costs", pct: 40, actual: 38, color: "#0D9488", icon: "⚙️" },
  { id: "2", name: "Tax Reserve", pct: 25, actual: 22, color: "#F59E0B", icon: "🏛️" },
  { id: "3", name: "Owner Pay", pct: 20, actual: 21, color: "#6366F1", icon: "👤" },
  { id: "4", name: "Growth Fund", pct: 15, actual: 19, color: "#EC4899", icon: "📈" },
]

function RuleCard({ rule }: { rule: Rule }) {
  const ratio = rule.actual / rule.pct
  const over = rule.actual > rule.pct
  const statusColor = over ? "#EF4444" : ratio > 0.9 ? "#F59E0B" : "#10B981"
  const revenue = 42500 // Mock monthly revenue
  const target = revenue * (rule.pct / 100)
  const actual = revenue * (rule.actual / 100)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${rule.color}15` }}>
            {rule.icon}
          </div>
          <div>
            <div className="font-bold text-slate-900">{rule.name}</div>
            <div className="text-xs text-slate-400">{rule.pct}% of revenue</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {over ? (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          )}
          <span className={`text-sm font-bold ${over ? "text-red-500" : "text-emerald-500"}`}>
            {over ? "+" : ""}{rule.actual - rule.pct}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(ratio * 100, 100)}%`, background: statusColor }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Actual: {rule.actual}%</span>
          <span>Target: {rule.pct}%</span>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Target</div>
          <div className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans'" }}>
            ${target.toLocaleString("en-AU", { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Actual</div>
          <div className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", color: over ? "#EF4444" : rule.color }}>
            ${actual.toLocaleString("en-AU", { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MoneyRulesPage() {
  const [rules] = useState<Rule[]>(INITIAL_RULES)
  const totalPct = rules.reduce((s, r) => s + r.pct, 0)
  const revenue = 42500

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Money Rules™
          </h1>
          <p className="text-slate-500 text-sm mt-1">March 2026 · Revenue: ${revenue.toLocaleString("en-AU")}</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm">
          <Plus className="w-4 h-4" /> Add rule
        </button>
      </div>

      {/* Allocation Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="text-sm text-slate-500 mb-3 font-medium">Revenue Allocation</div>
        <div className="flex rounded-full overflow-hidden h-5 bg-slate-100">
          {rules.map(r => (
            <div
              key={r.id}
              className="h-full transition-all duration-500"
              style={{ width: `${r.pct}%`, background: r.color }}
              title={`${r.name}: ${r.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {rules.map(r => (
            <div key={r.id} className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-sm" style={{ background: r.color }} />
              {r.name} ({r.pct}%)
            </div>
          ))}
          {totalPct < 100 && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-sm bg-slate-200" />
              Unallocated ({100 - totalPct}%)
            </div>
          )}
        </div>
      </div>

      {/* Rule Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {rules.map(r => <RuleCard key={r.id} rule={r} />)}
      </div>

      {/* AI Insight */}
      <div className="bg-teal-900 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-white">
          <div className="font-bold mb-1">AI Insight</div>
          <p className="text-teal-200 text-sm leading-relaxed">
            Your Growth Fund is 4% over target this month ($8,075 vs $6,375 target). Consider redirecting $1,700
            to your Tax Reserve — your Q3 BAS is due in 41 days and you&apos;re $1,275 short of your target reserve.
          </p>
        </div>
      </div>
    </div>
  )
}
