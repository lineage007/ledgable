"use client"

import { useState } from "react"

type Rule = {
  id: string; name: string; condition: string; action: string; enabled: boolean;
  icon: string; category: 'save' | 'alert' | 'categorize' | 'limit';
}

const PRESET_RULES: Rule[] = [
  { id: '1', name: 'Emergency Fund', condition: 'Every deposit over $1,000', action: 'Save 20% to Emergency Fund', enabled: false, icon: '🛟', category: 'save' },
  { id: '2', name: 'Low Balance Alert', condition: 'Cash drops below $5,000', action: 'Send alert notification', enabled: false, icon: '⚠️', category: 'alert' },
  { id: '3', name: 'Auto-categorize Uber', condition: 'Transaction from Uber', action: 'Categorize as Transport', enabled: false, icon: '🚗', category: 'categorize' },
  { id: '4', name: 'Spending Cap', condition: 'Category "Entertainment" exceeds $500/mo', action: 'Send warning', enabled: false, icon: '🎬', category: 'limit' },
  { id: '5', name: 'Tax Savings', condition: 'Every invoice paid', action: 'Set aside 30% for tax', enabled: false, icon: '💰', category: 'save' },
  { id: '6', name: 'Large Expense Review', condition: 'Any expense over $1,000', action: 'Flag for review', enabled: false, icon: '🔍', category: 'alert' },
]

const ALLOCATIONS = [
  { name: 'Business Expenses', pct: 35, color: 'bg-emerald-500' },
  { name: 'Tax Reserve', pct: 30, color: 'bg-blue-500' },
  { name: 'Owner Draw', pct: 20, color: 'bg-amber-500' },
  { name: 'Growth Fund', pct: 10, color: 'bg-purple-500' },
  { name: 'Emergency', pct: 5, color: 'bg-red-500' },
]

export default function MoneyRulesPage() {
  const [rules, setRules] = useState(PRESET_RULES)
  const [showCreate, setShowCreate] = useState(false)

  const toggleRule = (id: string) => setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  const activeCount = rules.filter(r => r.enabled).length

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Money Rules</h1>
          <p className="text-sm text-muted-foreground">Automate your financial habits with smart rules</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
          + Create Rule
        </button>
      </div>

      {/* Income Allocation */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold mb-4">Income Allocation Strategy</h3>
        <p className="text-sm text-muted-foreground mb-4">Set how incoming money should be distributed automatically</p>
        
        {/* Bar visualization */}
        <div className="h-6 rounded-full overflow-hidden flex mb-4">
          {ALLOCATIONS.map(a => (
            <div key={a.name} className={`${a.color} transition-all`} style={{ width: `${a.pct}%` }} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ALLOCATIONS.map(a => (
            <div key={a.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${a.color}`} />
              <div>
                <div className="text-xs font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Active Rules ({activeCount})</h3>
        </div>
        
        {rules.map(rule => (
          <div key={rule.id} className={`rounded-xl border p-4 transition-all ${
            rule.enabled ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{rule.icon}</span>
                <div>
                  <div className="font-medium text-sm">{rule.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    <span className="text-amber-400">IF</span> {rule.condition} → <span className="text-emerald-400">THEN</span> {rule.action}
                  </div>
                </div>
              </div>
              <button onClick={() => toggleRule(rule.id)}
                className={`w-12 h-6 rounded-full transition-colors relative ${rule.enabled ? 'bg-emerald-500' : 'bg-accent'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${rule.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Create Money Rule</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Rule Name</label>
                <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="e.g., Save for vacation" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">When (Condition)</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                  <option>Every deposit over $...</option>
                  <option>Cash drops below $...</option>
                  <option>Transaction from...</option>
                  <option>Category exceeds $/mo...</option>
                  <option>Any expense over $...</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Then (Action)</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                  <option>Save X% to fund</option>
                  <option>Send alert</option>
                  <option>Auto-categorize as...</option>
                  <option>Flag for review</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">Create Rule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
