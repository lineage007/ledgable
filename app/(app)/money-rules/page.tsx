"use client"

import { useState, useCallback } from "react"
import { Wallet, Shield, TrendingUp, AlertTriangle, Tag, PiggyBank, ChevronDown, ChevronUp, Plus, MoreHorizontal, Pencil, Trash2, Power, Sparkles, X, Check, DollarSign, Percent, Bell, FolderOpen, Search } from "lucide-react"

// ── Types ──
type Rule = {
  id: string; name: string; conditionType: string; conditionValue: string; actionType: string; actionValue: string;
  enabled: boolean; category: 'save' | 'alert' | 'categorize' | 'limit';
  description?: string; lastTriggered?: string; triggerCount?: number;
}

type Bucket = { id: string; name: string; pct: number; color: string; amount: number; description: string }

// ── Category chips ──
const CAT_META: Record<string, { label: string; color: string; bg: string }> = {
  save: { label: 'Savings', color: 'text-teal-600', bg: 'bg-teal-500/10' },
  alert: { label: 'Alert', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  categorize: { label: 'Auto-tag', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  limit: { label: 'Limit', color: 'text-rose-600', bg: 'bg-rose-500/10' },
}

const BUCKET_COLORS = ['bg-teal-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500']

const CONDITION_OPTIONS = [
  { value: 'deposit_over', label: 'Any deposit over', unit: '$', placeholder: '1000' },
  { value: 'balance_below', label: 'Balance drops below', unit: '$', placeholder: '5000' },
  { value: 'merchant_match', label: 'Transaction from', unit: 'text', placeholder: 'Uber, DiDi' },
  { value: 'category_exceeds', label: 'Category spending exceeds', unit: '$/mo', placeholder: '500' },
  { value: 'expense_over', label: 'Any single expense over', unit: '$', placeholder: '2000' },
  { value: 'invoice_paid', label: 'Invoice is marked as paid', unit: 'none', placeholder: '' },
]

const ACTION_OPTIONS = [
  { value: 'move_pct', label: 'Move % to bucket', needsPct: true, needsBucket: true },
  { value: 'move_fixed', label: 'Move fixed $ to bucket', needsAmount: true, needsBucket: true },
  { value: 'notify', label: 'Send notification', needsPct: false },
  { value: 'categorize_as', label: 'Auto-categorize as', needsCategory: true },
  { value: 'flag_review', label: 'Flag for manual review', needsPct: false },
]

const CATEGORY_LIST = ['Motor Vehicle', 'Office Supplies', 'Utilities', 'Groceries', 'Transport', 'Entertainment', 'Professional Services', 'Insurance', 'Subscriptions', 'Advertising']

export default function MoneyRulesPage() {
  // ── Buckets (editable allocation) ──
  const [buckets, setBuckets] = useState<Bucket[]>([
    { id: '1', name: 'Business Expenses', pct: 35, color: 'bg-teal-500', amount: 4375, description: 'Rent, utilities, subscriptions, supplies' },
    { id: '2', name: 'Tax Reserve', pct: 30, color: 'bg-blue-500', amount: 3750, description: 'GST, income tax, super contributions' },
    { id: '3', name: 'Owner Draw', pct: 20, color: 'bg-amber-500', amount: 2500, description: 'Your personal salary from the business' },
    { id: '4', name: 'Growth Fund', pct: 10, color: 'bg-purple-500', amount: 1250, description: 'Marketing, new equipment, hiring' },
    { id: '5', name: 'Emergency', pct: 5, color: 'bg-rose-500', amount: 625, description: 'Minimum 3 months operating costs' },
  ])
  const [editingBuckets, setEditingBuckets] = useState(false)
  const [addingBucket, setAddingBucket] = useState(false)
  const [newBucketName, setNewBucketName] = useState('')
  const [newBucketPct, setNewBucketPct] = useState('')
  const totalPct = buckets.reduce((s, b) => s + b.pct, 0)
  const INCOME = 12500

  const updateBucketPct = (id: string, newPct: number) => {
    setBuckets(bs => bs.map(b => b.id === id ? { ...b, pct: Math.max(0, Math.min(100, newPct)), amount: Math.round(INCOME * newPct / 100) } : b))
  }
  const removeBucket = (id: string) => setBuckets(bs => bs.filter(b => b.id !== id))
  const addBucket = () => {
    if (!newBucketName.trim()) return
    const pct = parseInt(newBucketPct) || 5
    setBuckets(bs => [...bs, {
      id: Date.now().toString(), name: newBucketName.trim(), pct, color: BUCKET_COLORS[bs.length % BUCKET_COLORS.length],
      amount: Math.round(INCOME * pct / 100), description: ''
    }])
    setNewBucketName('')
    setNewBucketPct('')
    setAddingBucket(false)
  }

  // ── Rules ──
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'Tax Auto-Set-Aside', conditionType: 'invoice_paid', conditionValue: '', actionType: 'move_pct', actionValue: '30|Tax Reserve', enabled: true, category: 'save', description: 'Profit First: never miss a BAS payment', lastTriggered: '2 days ago', triggerCount: 14 },
    { id: '2', name: 'Low Cash Alert', conditionType: 'balance_below', conditionValue: '5000', actionType: 'notify', actionValue: '', enabled: true, category: 'alert', description: 'Early warning before cash crunch', lastTriggered: 'Never', triggerCount: 0 },
    { id: '3', name: 'Uber = Transport', conditionType: 'merchant_match', conditionValue: 'Uber, DiDi, 13cabs', actionType: 'categorize_as', actionValue: 'Motor Vehicle', enabled: true, category: 'categorize', lastTriggered: '5 hours ago', triggerCount: 23 },
    { id: '4', name: 'Entertainment Cap', conditionType: 'category_exceeds', conditionValue: '500', actionType: 'notify', actionValue: '', enabled: false, category: 'limit' },
  ])
  const [showCreate, setShowCreate] = useState(false)
  const toggleRule = (id: string) => setRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  const deleteRule = (id: string) => setRules(rs => rs.filter(r => r.id !== id))
  const activeCount = rules.filter(r => r.enabled).length

  // ── Create Rule State ──
  const [newName, setNewName] = useState('')
  const [newCondType, setNewCondType] = useState('deposit_over')
  const [newCondValue, setNewCondValue] = useState('')
  const [newActType, setNewActType] = useState('move_pct')
  const [newActPct, setNewActPct] = useState('')
  const [newActBucket, setNewActBucket] = useState('')
  const [newActCategory, setNewActCategory] = useState('Motor Vehicle')

  const condOpt = CONDITION_OPTIONS.find(c => c.value === newCondType)
  const actOpt = ACTION_OPTIONS.find(a => a.value === newActType)

  const inferCategory = (actType: string): Rule['category'] => {
    if (actType === 'move_pct' || actType === 'move_fixed') return 'save'
    if (actType === 'notify') return 'alert'
    if (actType === 'categorize_as') return 'categorize'
    return 'limit'
  }

  const createRule = () => {
    if (!newName.trim()) return
    let actionValue = ''
    if (actOpt?.needsPct) actionValue = `${newActPct}|${newActBucket}`
    else if (actOpt?.needsAmount) actionValue = `${newActPct}|${newActBucket}`
    else if (actOpt?.needsCategory) actionValue = newActCategory

    const condLabel = condOpt ? `${condOpt.label}${newCondValue ? ` ${condOpt.unit === '$' ? '$' : ''}${newCondValue}${condOpt.unit === '$/mo' ? '/mo' : ''}` : ''}` : ''
    const actLabel = actOpt ? actOpt.label : ''

    setRules(rs => [...rs, {
      id: Date.now().toString(), name: newName.trim(),
      conditionType: newCondType, conditionValue: newCondValue,
      actionType: newActType, actionValue,
      enabled: true, category: inferCategory(newActType),
      description: `${condLabel} → ${actLabel}`,
      triggerCount: 0,
    }])
    setShowCreate(false)
    setNewName(''); setNewCondValue(''); setNewActPct(''); setNewActBucket('')
  }

  const fmtCondition = (r: Rule) => {
    const opt = CONDITION_OPTIONS.find(c => c.value === r.conditionType)
    if (!opt) return r.conditionType
    if (opt.unit === 'none') return opt.label
    const prefix = opt.unit === '$' || opt.unit === '$/mo' ? '$' : ''
    const suffix = opt.unit === '$/mo' ? '/mo' : ''
    return `${opt.label} ${prefix}${r.conditionValue}${suffix}`
  }

  const fmtAction = (r: Rule) => {
    const opt = ACTION_OPTIONS.find(a => a.value === r.actionType)
    if (!opt) return r.actionType
    if (r.actionType === 'move_pct') { const [pct, bucket] = r.actionValue.split('|'); return `Move ${pct}% to ${bucket}` }
    if (r.actionType === 'move_fixed') { const [amt, bucket] = r.actionValue.split('|'); return `Move $${amt} to ${bucket}` }
    if (r.actionType === 'categorize_as') return `Auto-categorize as ${r.actionValue}`
    return opt.label
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">

      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2" style={{ letterSpacing: "-0.02em", color: "#1A1A2E" }}>
            Money Rules
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 uppercase tracking-wider">Only on Ledgable</span>
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">Automate how every dollar is distributed — inspired by Profit First</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-lg bg-[#0D9488] text-white text-sm font-semibold hover:bg-[#0F766E] flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {/* ═══ Income Allocation ═══ */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="p-5 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#1A1A2E] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#6B7280]" /> Income Allocation
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">Tap any bucket to expand · percentages are fully editable</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Monthly Income</div>
            <div className="text-lg font-bold font-mono tabular-nums text-[#1A1A2E]">${INCOME.toLocaleString()}</div>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="px-5">
          <div className="h-10 rounded-lg overflow-hidden flex bg-[#F1F3F5]">
            {buckets.map(b => (
              <div key={b.id} className={`${b.color} transition-all relative cursor-pointer hover:brightness-110`}
                style={{ width: `${b.pct}%` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{b.pct > 4 ? `${b.pct}%` : ''}</span>
                </div>
              </div>
            ))}
            {totalPct < 100 && (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] text-[#9CA3AF] font-medium">{100 - totalPct}% unallocated</span>
              </div>
            )}
          </div>
          {totalPct !== 100 && (
            <div className={`text-[11px] mt-1.5 font-medium ${totalPct > 100 ? 'text-rose-500' : 'text-amber-500'}`}>
              {totalPct > 100 ? `⚠ Over-allocated by ${totalPct - 100}%` : `${100 - totalPct}% unallocated — add a bucket or adjust percentages`}
            </div>
          )}
        </div>

        {/* Bucket rows */}
        <div className="p-5 pt-4 space-y-2">
          {buckets.map(b => (
            <BucketRow key={b.id} bucket={b} editing={editingBuckets} income={INCOME}
              onChangePct={(pct) => updateBucketPct(b.id, pct)}
              onRemove={() => removeBucket(b.id)} />
          ))}

          {/* Add bucket inline */}
          {addingBucket ? (
            <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#0D9488]/40 rounded-lg bg-[#0D9488]/[0.02]">
              <input value={newBucketName} onChange={e => setNewBucketName(e.target.value)}
                placeholder="Bucket name" className="flex-1 text-sm bg-transparent outline-none border-b border-[#E5E7EB] pb-0.5 focus:border-[#0D9488]" />
              <div className="flex items-center gap-1 bg-[#F1F3F5] rounded-md px-2">
                <input value={newBucketPct} onChange={e => setNewBucketPct(e.target.value.replace(/\D/g, ''))}
                  placeholder="5" className="w-8 text-sm text-right bg-transparent outline-none font-mono" />
                <Percent className="w-3 h-3 text-[#9CA3AF]" />
              </div>
              <button onClick={addBucket} className="p-1.5 rounded-md bg-[#0D9488] text-white hover:bg-[#0F766E]"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={() => { setAddingBucket(false); setNewBucketName(''); setNewBucketPct('') }} className="p-1.5 rounded-md hover:bg-[#F1F3F5]"><X className="w-3.5 h-3.5 text-[#6B7280]" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-1">
              <button onClick={() => setAddingBucket(true)}
                className="text-xs text-[#0D9488] font-medium hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add bucket
              </button>
              <span className="text-[#E5E7EB]">·</span>
              <button onClick={() => setEditingBuckets(!editingBuckets)}
                className="text-xs text-[#6B7280] hover:text-[#1A1A2E] flex items-center gap-1 transition-colors">
                <Pencil className="w-3 h-3" /> {editingBuckets ? 'Done editing' : 'Edit percentages'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Automation Rules ═══ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1A1A2E] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#6B7280]" /> Automation Rules
            <span className="text-xs text-[#6B7280]">({activeCount} active)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {rules.map(rule => {
            const cat = CAT_META[rule.category]
            return (
              <div key={rule.id} className={`rounded-xl border p-4 transition-all hover:shadow-sm ${
                rule.enabled ? 'border-[#0D9488]/20 bg-[#0D9488]/[0.01]' : 'border-[#E5E7EB] opacity-50 hover:opacity-70'
              }`} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.bg} ${cat.color}`}>
                    {rule.category === 'save' ? <PiggyBank className="w-4 h-4" /> :
                     rule.category === 'alert' ? <Bell className="w-4 h-4" /> :
                     rule.category === 'categorize' ? <Tag className="w-4 h-4" /> :
                     <Shield className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#1A1A2E]">{rule.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] flex-wrap">
                      <span className="font-semibold text-amber-500">IF</span>
                      <span className="text-[#6B7280]">{fmtCondition(rule)}</span>
                      <span className="text-[#9CA3AF] mx-1">→</span>
                      <span className="font-semibold text-teal-500">THEN</span>
                      <span className="text-[#6B7280]">{fmtAction(rule)}</span>
                    </div>
                    {rule.enabled && rule.triggerCount !== undefined && (
                      <div className="text-[10px] text-[#9CA3AF] mt-1.5">
                        {rule.lastTriggered && <>Last: {rule.lastTriggered} · </>}{rule.triggerCount} times
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => deleteRule(rule.id)} className="p-1.5 rounded-md hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleRule(rule.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${rule.enabled ? 'bg-[#0D9488]' : 'bg-[#E5E7EB]'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ AI Suggestions ═══ */}
      <div className="rounded-xl border border-dashed border-[#0D9488]/30 bg-[#0D9488]/[0.02] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <h3 className="font-semibold text-sm text-[#1A1A2E]">Ledge AI Suggestions</h3>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Auto-categorize Woolworths → Groceries', desc: '12 uncategorized Woolworths transactions' },
            { name: 'Subscription alert if Spotify > $15', desc: 'Detected recurring $14.99 charge' },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB]/50 last:border-0">
              <div>
                <div className="text-sm font-medium text-[#1A1A2E]">{s.name}</div>
                <div className="text-xs text-[#6B7280]">{s.desc}</div>
              </div>
              <button className="text-xs text-[#0D9488] font-semibold hover:underline shrink-0 ml-4">Enable</button>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Create Rule Modal ═══ */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-white border border-[#E5E7EB] rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-0 md:mx-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#F1F3F5] px-5 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E]">New Money Rule</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Fill in the details — Ledgable automates the rest</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-[#F1F3F5] transition-colors">
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Rule name */}
              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">Rule Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g., Save 20% for tax"
                  className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none transition-all" />
              </div>

              {/* When this happens */}
              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">
                  <span className="text-amber-500">IF</span> — When this happens
                </label>
                <select value={newCondType} onChange={e => { setNewCondType(e.target.value); setNewCondValue('') }}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none transition-all">
                  {CONDITION_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}{c.unit === '$' ? ' $...' : c.unit === '$/mo' ? ' $/month' : c.unit === 'text' ? '...' : ''}</option>)}
                </select>
                {condOpt && condOpt.unit !== 'none' && (
                  <div className="mt-2 relative">
                    {(condOpt.unit === '$' || condOpt.unit === '$/mo') && (
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    )}
                    {condOpt.unit === 'text' && (
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    )}
                    <input value={newCondValue} onChange={e => setNewCondValue(e.target.value)}
                      placeholder={condOpt.placeholder}
                      className={`w-full py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none font-mono transition-all ${condOpt.unit !== 'text' ? 'pl-9 pr-3.5' : 'pl-9 pr-3.5'}`} />
                    {condOpt.unit === '$/mo' && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">per month</span>
                    )}
                  </div>
                )}
              </div>

              {/* Then do this */}
              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">
                  <span className="text-teal-500">THEN</span> — Do this
                </label>
                <select value={newActType} onChange={e => setNewActType(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none transition-all">
                  {ACTION_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>

                {/* Dynamic sub-fields based on action type */}
                <div className="mt-2 space-y-2">
                  {(actOpt?.needsPct) && (
                    <div className="relative">
                      <input value={newActPct} onChange={e => setNewActPct(e.target.value.replace(/\D/g, ''))}
                        placeholder="30" type="text" inputMode="numeric"
                        className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none font-mono transition-all" />
                      <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    </div>
                  )}
                  {(actOpt?.needsAmount) && (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      <input value={newActPct} onChange={e => setNewActPct(e.target.value.replace(/\D/g, ''))}
                        placeholder="500" type="text" inputMode="numeric"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none font-mono transition-all" />
                    </div>
                  )}
                  {(actOpt?.needsBucket) && (
                    <select value={newActBucket} onChange={e => setNewActBucket(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none transition-all">
                      <option value="">Choose a bucket...</option>
                      {buckets.map(b => <option key={b.id} value={b.name}>{b.name} ({b.pct}%)</option>)}
                    </select>
                  )}
                  {(actOpt?.needsCategory) && (
                    <select value={newActCategory} onChange={e => setNewActCategory(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none appearance-none transition-all">
                      {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Preview */}
              {newName && (
                <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-3.5">
                  <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Preview</div>
                  <div className="text-sm text-[#1A1A2E]">
                    <span className="font-semibold text-amber-500">IF </span>
                    <span>{condOpt?.label || '...'} {newCondValue && <>{condOpt?.unit === '$' ? '$' : ''}{newCondValue}{condOpt?.unit === '$/mo' ? '/mo' : ''}</>}</span>
                    <span className="text-[#9CA3AF] mx-1.5">→</span>
                    <span className="font-semibold text-teal-500">THEN </span>
                    <span>{actOpt?.label || '...'} {newActPct && <>{actOpt?.needsPct ? `${newActPct}%` : `$${newActPct}`}</>} {newActBucket && <>to {newActBucket}</>} {actOpt?.needsCategory && newActCategory}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
                  Cancel
                </button>
                <button onClick={createRule} disabled={!newName.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0D9488] text-white text-sm font-semibold hover:bg-[#0F766E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Bucket Row Component ──

function BucketRow({ bucket, editing, income, onChangePct, onRemove }: {
  bucket: Bucket; editing: boolean; income: number; onChangePct: (pct: number) => void; onRemove: () => void
}) {
  const amount = Math.round(income * bucket.pct / 100)
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
      <div className={`w-3 h-3 rounded-full ${bucket.color} shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#1A1A2E]">{bucket.name}</div>
        {bucket.description && <div className="text-[11px] text-[#9CA3AF] truncate">{bucket.description}</div>}
      </div>
      {editing ? (
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#F1F3F5] rounded-lg overflow-hidden">
            <button onClick={() => onChangePct(bucket.pct - 5)} className="px-2 py-1 text-sm font-bold text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">−</button>
            <span className="px-2 py-1 text-sm font-mono font-bold text-[#1A1A2E] w-10 text-center">{bucket.pct}%</span>
            <button onClick={() => onChangePct(bucket.pct + 5)} className="px-2 py-1 text-sm font-bold text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">+</button>
          </div>
          <button onClick={onRemove} className="p-1 rounded hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="text-right shrink-0">
          <div className="font-mono text-sm tabular-nums font-semibold text-[#1A1A2E]">${amount.toLocaleString()}</div>
          <div className="text-[10px] text-[#9CA3AF] font-mono">{bucket.pct}%</div>
        </div>
      )}
    </div>
  )
}
