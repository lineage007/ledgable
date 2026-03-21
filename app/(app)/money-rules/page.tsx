"use client"

import { useState } from "react"
import { Wallet, Shield, TrendingUp, AlertTriangle, Tag, PiggyBank, ChevronDown, ChevronUp, Plus, MoreHorizontal, Pencil, Trash2, Power, Sparkles } from "lucide-react"

type Rule = {
  id: string; name: string; condition: string; action: string; enabled: boolean;
  icon: React.ReactNode; category: 'save' | 'alert' | 'categorize' | 'limit';
  description?: string; lastTriggered?: string; triggerCount?: number;
}

type Allocation = {
  name: string; pct: number; color: string; colorDot: string; amount: number; target: number; overTarget?: boolean;
  description: string;
}

const INCOME_TOTAL = 12500

const ALLOCATIONS: Allocation[] = [
  { name: 'Business Expenses', pct: 35, color: 'bg-teal-500', colorDot: 'bg-teal-500', amount: 4375, target: 4375, description: 'Rent, utilities, subscriptions, supplies' },
  { name: 'Tax Reserve', pct: 30, color: 'bg-blue-500', colorDot: 'bg-blue-500', amount: 4200, target: 3750, overTarget: true, description: 'GST, income tax, super contributions' },
  { name: 'Owner Draw', pct: 20, color: 'bg-amber-500', colorDot: 'bg-amber-500', amount: 2500, target: 2500, description: 'Your personal salary from the business' },
  { name: 'Growth Fund', pct: 10, color: 'bg-purple-500', colorDot: 'bg-purple-500', amount: 1000, target: 1250, description: 'Marketing, new equipment, hiring' },
  { name: 'Emergency', pct: 5, color: 'bg-rose-500', colorDot: 'bg-rose-500', amount: 625, target: 625, description: 'Minimum 3 months operating costs' },
]

const PRESET_RULES: Rule[] = [
  { id: '1', name: 'Tax Savings Auto-Set-Aside', condition: 'Every invoice is paid', action: 'Move 30% to Tax Reserve bucket', enabled: true,
    icon: <PiggyBank className="w-4 h-4" />, category: 'save', description: 'Based on Profit First methodology — never miss a BAS payment again',
    lastTriggered: '2 days ago', triggerCount: 14 },
  { id: '2', name: 'Low Cash Alert', condition: 'Operating account drops below $5,000', action: 'Send push notification + email', enabled: true,
    icon: <AlertTriangle className="w-4 h-4" />, category: 'alert', description: 'Early warning before cash crunch hits',
    lastTriggered: 'Never', triggerCount: 0 },
  { id: '3', name: 'Uber = Transport', condition: 'Any transaction from Uber, DiDi, or 13cabs', action: 'Auto-categorize as Motor Vehicle Expenses (648)', enabled: true,
    icon: <Tag className="w-4 h-4" />, category: 'categorize', description: 'No more manual categorizing ride receipts',
    lastTriggered: '5 hours ago', triggerCount: 23 },
  { id: '4', name: 'Entertainment Spending Cap', condition: 'Entertainment category exceeds $500 this month', action: 'Alert + flag all new entertainment transactions', enabled: false,
    icon: <Shield className="w-4 h-4" />, category: 'limit', description: 'Keep discretionary spending in check' },
  { id: '5', name: 'Emergency Fund Builder', condition: 'Every deposit over $1,000', action: 'Save 5% to Emergency fund', enabled: false,
    icon: <Wallet className="w-4 h-4" />, category: 'save', description: 'Automatic micro-saving on larger deposits' },
  { id: '6', name: 'Large Expense Review', condition: 'Any single expense over $2,000', action: 'Flag for manual review before processing', enabled: true,
    icon: <AlertTriangle className="w-4 h-4" />, category: 'alert', description: 'Catch unusual charges before they slip through',
    lastTriggered: '1 week ago', triggerCount: 3 },
]

const CAT_COLORS = { save: 'text-teal-500 bg-teal-500/10', alert: 'text-amber-500 bg-amber-500/10', categorize: 'text-blue-500 bg-blue-500/10', limit: 'text-rose-500 bg-rose-500/10' }
const CAT_LABELS = { save: 'Savings', alert: 'Alert', categorize: 'Auto-categorize', limit: 'Spending Limit' }

export default function MoneyRulesPage() {
  const [rules, setRules] = useState(PRESET_RULES)
  const [showCreate, setShowCreate] = useState(false)
  const [expandedAlloc, setExpandedAlloc] = useState<string | null>(null)
  const [editingPct, setEditingPct] = useState(false)

  const toggleRule = (id: string) => setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  const activeCount = rules.filter(r => r.enabled).length

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Money Rules
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 uppercase tracking-wider">Only on Ledgable</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Automate your financial habits — inspired by Profit First methodology</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      {/* Income Allocation — Visual */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              Income Allocation Strategy
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Every dollar that comes in is automatically distributed</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">This month&apos;s income</div>
            <div className="text-lg font-bold font-mono tabular-nums">${INCOME_TOTAL.toLocaleString()}</div>
          </div>
        </div>

        {/* Visual allocation bar */}
        <div className="px-5">
          <div className="h-8 rounded-lg overflow-hidden flex shadow-inner bg-muted/30">
            {ALLOCATIONS.map(a => (
              <div key={a.name} className={`${a.color} transition-all relative group cursor-pointer`}
                style={{ width: `${a.pct}%` }}
                onClick={() => setExpandedAlloc(expandedAlloc === a.name ? null : a.name)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{a.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation detail rows */}
        <div className="p-5 pt-4 space-y-2">
          {ALLOCATIONS.map(a => {
            const pctUsed = (a.amount / a.target) * 100
            const isExpanded = expandedAlloc === a.name
            return (
              <div key={a.name} className={`rounded-lg border transition-all ${isExpanded ? 'border-border bg-muted/30' : 'border-transparent'}`}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/20 rounded-lg transition-colors"
                  onClick={() => setExpandedAlloc(isExpanded ? null : a.name)}>
                  <div className={`w-3 h-3 rounded-full ${a.colorDot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{a.name}</span>
                      <span className="font-mono text-sm tabular-nums font-semibold">
                        ${a.amount.toLocaleString()}
                        <span className="text-muted-foreground font-normal"> / ${a.target.toLocaleString()}</span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${a.overTarget ? 'bg-amber-500' : a.color}`}
                        style={{ width: `${Math.min(pctUsed, 100)}%` }} />
                    </div>
                  </div>
                  {a.overTarget && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 ml-6">
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                    {a.overTarget && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 bg-amber-500/5 rounded-md px-2.5 py-1.5">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Over target by ${(a.amount - a.target).toLocaleString()} — review spending or adjust allocation</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="px-5 pb-4 flex items-center justify-between border-t border-border pt-3">
          <button onClick={() => setEditingPct(!editingPct)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <Pencil className="w-3 h-3" /> Edit percentages
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            Ledge AI will suggest adjustments based on your spending patterns
          </div>
        </div>
      </div>

      {/* Smart Rules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            Automation Rules
            <span className="text-xs text-muted-foreground">({activeCount} active)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {rules.map(rule => {
            const catStyle = CAT_COLORS[rule.category]
            return (
              <div key={rule.id} className={`rounded-xl border p-4 transition-all ${
                rule.enabled ? 'border-primary/20 bg-primary/[0.02]' : 'border-border opacity-60 hover:opacity-80'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${catStyle}`}>
                    {rule.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{rule.name}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${catStyle}`}>
                        {CAT_LABELS[rule.category]}
                      </span>
                    </div>
                    {rule.description && <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-[11px]">
                      <span>
                        <span className="text-amber-500 font-semibold">IF</span>{' '}
                        <span className="text-muted-foreground">{rule.condition}</span>
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span>
                        <span className="text-teal-500 font-semibold">THEN</span>{' '}
                        <span className="text-muted-foreground">{rule.action}</span>
                      </span>
                    </div>
                    {rule.enabled && rule.lastTriggered && (
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span>Last triggered: {rule.lastTriggered}</span>
                        <span>·</span>
                        <span>{rule.triggerCount} times total</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => toggleRule(rule.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${rule.enabled ? 'bg-primary' : 'bg-muted'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Suggested rules — AI */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.02] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Ledge AI Suggestions</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <div className="text-sm font-medium">Auto-categorize Woolworths → Groceries</div>
              <div className="text-xs text-muted-foreground">You have 12 uncategorized Woolworths transactions</div>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">Enable</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Subscription tracker — flag if Spotify charges over $15</div>
              <div className="text-xs text-muted-foreground">Detected recurring $14.99 charge from Spotify</div>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">Enable</button>
          </div>
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1">Create Money Rule</h3>
            <p className="text-sm text-muted-foreground mb-5">Set a condition and action — Ledgable handles the rest</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Rule Name</label>
                <input className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g., Save for vacation" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">When this happens</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
                  <option>Every deposit over $...</option>
                  <option>Operating account drops below $...</option>
                  <option>Transaction from a specific merchant...</option>
                  <option>Category spending exceeds $/month...</option>
                  <option>Any single expense over $...</option>
                  <option>Invoice is marked as paid</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Then do this</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
                  <option>Move X% to a bucket</option>
                  <option>Send notification</option>
                  <option>Auto-categorize as...</option>
                  <option>Flag for manual review</option>
                  <option>Create a task</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                <button className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Rule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
