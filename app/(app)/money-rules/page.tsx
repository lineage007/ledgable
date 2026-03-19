"use client"

import { useState, useEffect, useTransition } from "react"
import { getMoneyRules, updateMoneyRule, getMoneyRuleSummary } from "./actions"
import { PiggyBank, Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MoneyRulesPage() {
  const [rules, setRules] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPct, setEditPct] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const r = await getMoneyRules()
    setRules(r)
    const s = await getMoneyRuleSummary()
    setSummary(s)
  }

  function startEdit(rule: any) {
    setEditingId(rule.id)
    setEditName(rule.name)
    setEditPct(String(rule.percentage))
  }

  function saveEdit(id: string) {
    startTransition(async () => {
      await updateMoneyRule(id, { name: editName, percentage: parseFloat(editPct) })
      setEditingId(null)
      loadData()
    })
  }

  const totalPct = rules.reduce((sum, r) => sum + Number(r.percentage), 0)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-emerald-600" /> Money Rules™
        </h1>
        <p className="text-slate-500 mt-1">
          Set spending buckets as percentages of your income. Every dollar has a job.
        </p>
      </div>

      {/* Donut visualization */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* SVG Donut */}
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-48 h-48 transform -rotate-90">
              {(() => {
                let offset = 0
                return rules.map((rule, i) => {
                  const pct = Number(rule.percentage)
                  const dash = pct * 0.9 // scale to 90 (leaving small gaps)
                  const el = (
                    <circle
                      key={i}
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke={rule.color || "#6366f1"}
                      strokeWidth="4"
                      strokeDasharray={`${dash} ${100 - dash}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  )
                  offset += pct
                  return el
                })
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">{totalPct}%</span>
              <span className="text-xs text-slate-400">allocated</span>
            </div>
          </div>

          {/* Rules list */}
          <div className="flex-1 w-full space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: rule.color }} />
                
                {editingId === rule.id ? (
                  <>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-32 h-8 text-sm" />
                    <Input value={editPct} onChange={e => setEditPct(e.target.value)} className="w-16 h-8 text-sm text-right" type="number" />
                    <span className="text-sm text-slate-400">%</span>
                    <Button size="sm" variant="ghost" onClick={() => saveEdit(rule.id)} disabled={isPending}>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium text-slate-900 flex-1">{rule.icon} {rule.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${rule.percentage}%`, backgroundColor: rule.color }} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-10 text-right">{Number(rule.percentage).toFixed(0)}%</span>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => startEdit(rule)}>
                        <Pencil className="w-3 h-3 text-slate-400" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly breakdown (if summary has data) */}
      {summary && summary.totalSpend > 0 && (
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{summary.month} Breakdown</h2>
          <div className="space-y-4">
            {summary.rules.map((rule: any) => (
              <div key={rule.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{rule.icon} {rule.name}</span>
                  <span className={rule.overBudget ? "text-red-500 font-bold" : "text-slate-600"}>
                    ${rule.spent.toFixed(2)} / ${rule.target.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (rule.spent / Math.max(rule.target, 1)) * 100)}%`,
                      backgroundColor: rule.overBudget ? "#ef4444" : rule.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
        <h3 className="font-semibold text-emerald-800 mb-2">💡 How Money Rules™ works</h3>
        <ul className="text-sm text-emerald-700 space-y-1">
          <li>• Set a percentage for each spending bucket (must total 100%)</li>
          <li>• Import bank transactions and assign them to categories</li>
          <li>• Ledgable auto-tracks your spending against your rules</li>
          <li>• Get alerts when you exceed a bucket threshold</li>
          <li>• Based on the <strong>Barefoot Investor</strong> approach, adapted for you</li>
        </ul>
      </div>
    </div>
  )
}
