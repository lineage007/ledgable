"use client"

import { useState, useMemo } from "react"
import { Plus, Search, ChevronDown, ChevronRight, Edit2, Trash2, X, Sparkles, Lock, Building2, CreditCard, TrendingUp, TrendingDown, Scale, Wallet } from "lucide-react"

// ─── Types ────────────────────────────────────────────────
type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
type AccountClass = 'current' | 'non_current' | 'fixed' | 'bank' | 'credit_card' | ''

type Account = {
  id: string; code: string; name: string; type: AccountType; accountClass: AccountClass;
  taxType: string; description: string; isSystem: boolean; isActive: boolean;
  balance?: number; currency: string;
}

const TYPE_META: Record<AccountType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  asset:     { label: 'Assets',      icon: <Wallet className="w-4 h-4" />,       color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  liability: { label: 'Liabilities', icon: <CreditCard className="w-4 h-4" />,   color: 'text-rose-400',    bg: 'bg-rose-500/10' },
  equity:    { label: 'Equity',      icon: <Scale className="w-4 h-4" />,         color: 'text-purple-400',  bg: 'bg-purple-500/10' },
  revenue:   { label: 'Revenue',     icon: <TrendingUp className="w-4 h-4" />,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  expense:   { label: 'Expenses',    icon: <TrendingDown className="w-4 h-4" />,  color: 'text-amber-400',   bg: 'bg-amber-500/10' },
}

const TAX_TYPES = [
  { code: 'GST', name: 'GST on Income/Expenses (10%)' },
  { code: 'FRE', name: 'GST Free (0%)' },
  { code: 'INP', name: 'Input Taxed (0%)' },
  { code: 'EXP', name: 'Export (0%)' },
  { code: 'BAS', name: 'BAS Excluded' },
  { code: 'CAP', name: 'GST on Capital (10%)' },
]

// ─── Australian Default Chart of Accounts ────────────────
const DEFAULT_ACCOUNTS: Account[] = [
  // Assets (100-199)
  { id: '1',  code: '090', name: 'Business Bank Account',        type: 'asset', accountClass: 'bank',        taxType: '', description: 'Main operating bank account', isSystem: true, isActive: true, balance: 24650.00, currency: 'AUD' },
  { id: '2',  code: '091', name: 'Business Savings Account',     type: 'asset', accountClass: 'bank',        taxType: '', description: 'Business savings', isSystem: false, isActive: true, balance: 85000.00, currency: 'AUD' },
  { id: '3',  code: '100', name: 'Accounts Receivable',          type: 'asset', accountClass: 'current',     taxType: '', description: 'Outstanding customer invoices', isSystem: true, isActive: true, balance: 21400.00, currency: 'AUD' },
  { id: '4',  code: '110', name: 'Prepayments',                  type: 'asset', accountClass: 'current',     taxType: 'GST', description: 'Payments made in advance', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '5',  code: '120', name: 'Inventory',                    type: 'asset', accountClass: 'current',     taxType: 'GST', description: 'Stock on hand', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '6',  code: '150', name: 'Office Equipment',             type: 'asset', accountClass: 'fixed',       taxType: 'GST', description: 'Computers, furniture, equipment', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '7',  code: '151', name: 'Less Accumulated Depreciation', type: 'asset', accountClass: 'fixed',      taxType: '', description: 'Depreciation on office equipment', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '8',  code: '160', name: 'Motor Vehicles',               type: 'asset', accountClass: 'fixed',       taxType: 'GST', description: 'Business vehicles', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '9',  code: '161', name: 'Less Accumulated Depreciation on Vehicles', type: 'asset', accountClass: 'fixed', taxType: '', description: '', isSystem: false, isActive: true, currency: 'AUD' },

  // Liabilities (200-299)
  { id: '10', code: '200', name: 'Accounts Payable',             type: 'liability', accountClass: 'current', taxType: '', description: 'Outstanding supplier bills', isSystem: true, isActive: true, balance: 6740.00, currency: 'AUD' },
  { id: '11', code: '210', name: 'GST Collected',                type: 'liability', accountClass: 'current', taxType: '', description: 'GST collected on sales', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '12', code: '215', name: 'GST Paid',                     type: 'liability', accountClass: 'current', taxType: '', description: 'GST paid on purchases', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '13', code: '220', name: 'PAYG Withholding Payable',     type: 'liability', accountClass: 'current', taxType: '', description: 'Employee tax withholdings', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '14', code: '230', name: 'Superannuation Payable',       type: 'liability', accountClass: 'current', taxType: '', description: 'Employee super contributions', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '15', code: '240', name: 'Income Tax Payable',           type: 'liability', accountClass: 'current', taxType: '', description: 'Provision for income tax', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '16', code: '250', name: 'Credit Card',                  type: 'liability', accountClass: 'credit_card', taxType: '', description: 'Business credit card', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '17', code: '260', name: 'Business Loan',                type: 'liability', accountClass: 'non_current', taxType: '', description: 'Long-term business loan', isSystem: false, isActive: true, currency: 'AUD' },

  // Equity (300-399)
  { id: '18', code: '300', name: "Owner's Equity",               type: 'equity', accountClass: '', taxType: '', description: 'Capital invested by owner', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '19', code: '310', name: 'Retained Earnings',            type: 'equity', accountClass: '', taxType: '', description: 'Accumulated profits', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '20', code: '320', name: "Owner's Drawings",             type: 'equity', accountClass: '', taxType: '', description: 'Personal withdrawals', isSystem: false, isActive: true, currency: 'AUD' },

  // Revenue (400-499)
  { id: '21', code: '400', name: 'Sales Revenue',                type: 'revenue', accountClass: '', taxType: 'GST', description: 'Income from goods and services', isSystem: true, isActive: true, balance: 145200.00, currency: 'AUD' },
  { id: '22', code: '410', name: 'Service Revenue',              type: 'revenue', accountClass: '', taxType: 'GST', description: 'Income from services rendered', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '23', code: '420', name: 'Interest Income',              type: 'revenue', accountClass: '', taxType: 'FRE', description: 'Bank interest received', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '24', code: '430', name: 'Other Revenue',                type: 'revenue', accountClass: '', taxType: 'GST', description: 'Miscellaneous income', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '25', code: '460', name: 'Discount Received',            type: 'revenue', accountClass: '', taxType: 'FRE', description: 'Discounts from suppliers', isSystem: false, isActive: true, currency: 'AUD' },

  // Expenses (500-899)
  { id: '26', code: '500', name: 'Cost of Goods Sold',           type: 'expense', accountClass: '', taxType: 'GST', description: 'Direct cost of goods/services sold', isSystem: true, isActive: true, balance: 52300.00, currency: 'AUD' },
  { id: '27', code: '600', name: 'Advertising & Marketing',      type: 'expense', accountClass: '', taxType: 'GST', description: 'Ads, social media, marketing costs', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '28', code: '610', name: 'Bank Fees',                    type: 'expense', accountClass: '', taxType: 'FRE', description: 'Bank charges and fees', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '29', code: '620', name: 'Cleaning',                     type: 'expense', accountClass: '', taxType: 'GST', description: 'Office cleaning services', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '30', code: '630', name: 'Consulting & Accounting',      type: 'expense', accountClass: '', taxType: 'GST', description: 'Professional fees (accountant, lawyer)', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '31', code: '640', name: 'Depreciation',                 type: 'expense', accountClass: '', taxType: 'BAS', description: 'Asset depreciation expense', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '32', code: '650', name: 'Entertainment',                type: 'expense', accountClass: '', taxType: 'GST', description: 'Client entertainment (50% deductible)', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '33', code: '660', name: 'Freight & Delivery',           type: 'expense', accountClass: '', taxType: 'GST', description: 'Postage, courier, shipping', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '34', code: '670', name: 'Insurance',                    type: 'expense', accountClass: '', taxType: 'FRE', description: 'Business insurance premiums', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '35', code: '680', name: 'Interest Expense',             type: 'expense', accountClass: '', taxType: 'FRE', description: 'Loan and credit card interest', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '36', code: '690', name: 'Motor Vehicle Expenses',       type: 'expense', accountClass: '', taxType: 'GST', description: 'Fuel, rego, servicing, tolls', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '37', code: '700', name: 'Office Expenses',              type: 'expense', accountClass: '', taxType: 'GST', description: 'Stationery, supplies, furniture', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '38', code: '710', name: 'Rent',                         type: 'expense', accountClass: '', taxType: 'GST', description: 'Office/premises rent', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '39', code: '715', name: 'Repairs & Maintenance',        type: 'expense', accountClass: '', taxType: 'GST', description: 'Equipment and premises repairs', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '40', code: '720', name: 'Salaries & Wages',             type: 'expense', accountClass: '', taxType: 'BAS', description: 'Employee wages and salaries', isSystem: true, isActive: true, currency: 'AUD' },
  { id: '41', code: '730', name: 'Superannuation Expense',       type: 'expense', accountClass: '', taxType: 'BAS', description: 'Employer super contributions', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '42', code: '740', name: 'Subscriptions',                type: 'expense', accountClass: '', taxType: 'GST', description: 'Software, memberships, publications', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '43', code: '750', name: 'Telephone & Internet',         type: 'expense', accountClass: '', taxType: 'GST', description: 'Phone, mobile, internet, NBN', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '44', code: '760', name: 'Travel & Accommodation',       type: 'expense', accountClass: '', taxType: 'GST', description: 'Flights, hotels, meals while travelling', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '45', code: '770', name: 'Utilities',                    type: 'expense', accountClass: '', taxType: 'GST', description: 'Electricity, gas, water', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '46', code: '800', name: 'Training & Education',         type: 'expense', accountClass: '', taxType: 'GST', description: 'Professional development, courses', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '47', code: '810', name: 'Licenses & Permits',           type: 'expense', accountClass: '', taxType: 'GST', description: 'Business licenses and permits', isSystem: false, isActive: true, currency: 'AUD' },
  { id: '48', code: '820', name: 'Bad Debts',                    type: 'expense', accountClass: '', taxType: 'BAS', description: 'Uncollectable customer debts', isSystem: false, isActive: true, currency: 'AUD' },
]

// ─── Main Page ──────────────────────────────────────────────
export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS)
  const [search, setSearch] = useState('')
  const [expandedTypes, setExpandedTypes] = useState<Set<AccountType>>(new Set(['asset', 'liability', 'equity', 'revenue', 'expense']))
  const [showCreate, setShowCreate] = useState(false)
  const [editAccount, setEditAccount] = useState<Account | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const toggleType = (t: AccountType) => {
    const next = new Set(expandedTypes)
    next.has(t) ? next.delete(t) : next.add(t)
    setExpandedTypes(next)
  }

  const filtered = useMemo(() => {
    let result = accounts.filter(a => showInactive || a.isActive)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.code.includes(q) || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [accounts, search, showInactive])

  const grouped = useMemo(() => {
    const g: Record<AccountType, Account[]> = { asset: [], liability: [], equity: [], revenue: [], expense: [] }
    filtered.forEach(a => g[a.type]?.push(a))
    // Sort each group by code
    Object.values(g).forEach(arr => arr.sort((a, b) => a.code.localeCompare(b.code)))
    return g
  }, [filtered])

  // Summary totals
  const totals = useMemo(() => {
    const t = { assets: 0, liabilities: 0, equity: 0, revenue: 0, expenses: 0 }
    accounts.forEach(a => {
      if (!a.balance) return
      if (a.type === 'asset') t.assets += a.balance
      if (a.type === 'liability') t.liabilities += a.balance
      if (a.type === 'equity') t.equity += a.balance
      if (a.type === 'revenue') t.revenue += a.balance
      if (a.type === 'expense') t.expenses += a.balance
    })
    return t
  }, [accounts])

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chart of Accounts</h1>
          <p className="text-sm text-muted-foreground">
            {accounts.length} accounts · Australian standard template
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {/* Summary strip — scrollable on mobile, grid on desktop */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-1 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-5 scrollbar-none">
        {(Object.entries(TYPE_META) as [AccountType, typeof TYPE_META.asset][]).map(([type, meta]) => {
          const val = type === 'asset' ? totals.assets : type === 'liability' ? totals.liabilities :
            type === 'equity' ? totals.equity : type === 'revenue' ? totals.revenue : totals.expenses
          return (
            <div key={type} className={`rounded-xl border border-border p-3 min-w-[140px] shrink-0 md:min-w-0 ${meta.bg}`}>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
                {meta.icon} {meta.label}
              </div>
              <div className="text-base md:text-lg font-bold mt-1 font-mono tabular-nums whitespace-nowrap">
                ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-muted-foreground">{grouped[type]?.length || 0} accounts</div>
            </div>
          )
        })}
      </div>

      {/* Search + filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm"
            placeholder="Search by code, name, or description..." />
        </div>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-accent">
          <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)}
            className="rounded" />
          Show inactive
        </label>
      </div>

      {/* Account groups */}
      <div className="space-y-2">
        {(Object.entries(TYPE_META) as [AccountType, typeof TYPE_META.asset][]).map(([type, meta]) => {
          const accs = grouped[type] || []
          const expanded = expandedTypes.has(type)
          return (
            <div key={type} className="rounded-xl border border-border overflow-hidden">
              {/* Group header */}
              <button onClick={() => toggleType(type)}
                className={`w-full px-4 py-3 flex items-center justify-between ${meta.bg} hover:opacity-90 transition-opacity`}>
                <div className="flex items-center gap-2">
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className={`font-semibold text-sm ${meta.color}`}>{meta.icon}</span>
                  <span className="font-semibold text-sm">{meta.label}</span>
                  <span className="text-xs text-muted-foreground">({accs.length})</span>
                </div>
                {accs.some(a => a.balance) && (
                  <span className="text-sm font-mono font-semibold">
                    ${accs.reduce((s, a) => s + (a.balance || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                )}
              </button>

              {/* Account rows */}
              {expanded && (
                <div className="divide-y divide-border">
                  {accs.map(account => (
                    <div key={account.id}
                      className="px-4 py-3 hover:bg-accent/30 cursor-pointer group"
                      onClick={() => setEditAccount(account)}>
                      {/* Mobile: stacked layout */}
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-muted-foreground w-8 pt-0.5 shrink-0">{account.code}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{account.name}</span>
                            {account.isSystem && <span title="System account"><Lock className="w-3 h-3 text-muted-foreground" /></span>}
                            {account.taxType && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-medium">{account.taxType}</span>
                            )}
                            {account.accountClass && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize hidden md:inline">{account.accountClass.replace('_', ' ')}</span>
                            )}
                            {!account.isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">Inactive</span>}
                          </div>
                          {account.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">{account.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {account.balance !== undefined && account.balance > 0 && (
                            <span className="font-mono text-sm font-medium tabular-nums">
                              ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <Edit2 className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {accs.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No {meta.label.toLowerCase()} accounts {search ? 'match your search' : 'yet'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      {(showCreate || editAccount) && (
        <AccountModal
          account={editAccount}
          onClose={() => { setShowCreate(false); setEditAccount(null) }}
          onSave={(a) => {
            if (editAccount) {
              setAccounts(accounts.map(x => x.id === a.id ? a : x))
            } else {
              setAccounts([...accounts, { ...a, id: Date.now().toString() }])
            }
            setShowCreate(false); setEditAccount(null)
          }}
          onDelete={editAccount && !editAccount.isSystem ? (id) => {
            setAccounts(accounts.filter(a => a.id !== id))
            setEditAccount(null)
          } : undefined}
        />
      )}
    </div>
  )
}

// ─── Account Create/Edit Modal ───────────────────────────────
function AccountModal({ account, onClose, onSave, onDelete }: {
  account: Account | null;
  onClose: () => void;
  onSave: (a: Account) => void;
  onDelete?: (id: string) => void;
}) {
  const isEdit = !!account
  const [code, setCode] = useState(account?.code || '')
  const [name, setName] = useState(account?.name || '')
  const [type, setType] = useState<AccountType>(account?.type || 'expense')
  const [accountClass, setAccountClass] = useState<AccountClass>(account?.accountClass || '')
  const [taxType, setTaxType] = useState(account?.taxType || '')
  const [description, setDescription] = useState(account?.description || '')
  const [isActive, setIsActive] = useState(account?.isActive ?? true)
  const [ledgeHint, setLedgeHint] = useState('')

  // Ledge AI: suggest tax type based on account type
  const handleTypeChange = (t: AccountType) => {
    setType(t)
    if (t === 'revenue' && !taxType) { setTaxType('GST'); setLedgeHint('💡 Ledge: Most Australian revenue accounts use GST on Income') }
    else if (t === 'expense' && !taxType) { setTaxType('GST'); setLedgeHint('💡 Ledge: Defaulted to GST — change to FRE for insurance/bank fees or BAS for wages') }
    else setLedgeHint('')
  }

  // Ledge AI: suggest account class based on code range
  const handleCodeChange = (c: string) => {
    setCode(c)
    const num = parseInt(c)
    if (num >= 90 && num < 100) { setAccountClass('bank'); setLedgeHint('💡 Ledge: Code 090-099 = bank accounts') }
    else if (num >= 100 && num < 200 && type === 'asset') { setAccountClass('current'); setLedgeHint('💡 Ledge: Code 100-199 = current assets') }
    else if (num >= 150 && num < 200 && type === 'asset') { setAccountClass('fixed'); setLedgeHint('💡 Ledge: Looks like a fixed asset') }
    else setLedgeHint('')
  }

  const handleSave = () => {
    onSave({
      id: account?.id || '',
      code, name, type, accountClass, taxType, description,
      isSystem: account?.isSystem || false, isActive, currency: 'AUD',
      balance: account?.balance,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">{isEdit ? 'Edit Account' : 'New Account'}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-accent"><X className="w-5 h-5" /></button>
          </div>

          {account?.isSystem && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> System account — some fields are locked
            </div>
          )}

          {ledgeHint && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0" /> {ledgeHint}
            </div>
          )}

          {/* Code + Name */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Code *</label>
              <input value={code} onChange={e => handleCodeChange(e.target.value)}
                disabled={account?.isSystem}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono disabled:opacity-50"
                placeholder="600" />
            </div>
            <div className="col-span-3">
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="e.g. Advertising & Marketing" />
            </div>
          </div>

          {/* Type + Class */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Type *</label>
              <select value={type} onChange={e => handleTypeChange(e.target.value as AccountType)}
                disabled={account?.isSystem}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm disabled:opacity-50">
                {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Classification</label>
              <select value={accountClass} onChange={e => setAccountClass(e.target.value as AccountClass)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
                <option value="">None</option>
                <option value="current">Current</option>
                <option value="non_current">Non-current</option>
                <option value="fixed">Fixed Asset</option>
                <option value="bank">Bank Account</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
          </div>

          {/* Tax Type */}
          <div className="mb-3">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Default Tax Rate</label>
            <select value={taxType} onChange={e => setTaxType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm">
              <option value="">No default</option>
              {TAX_TYPES.map(t => <option key={t.code} value={t.code}>{t.code} — {t.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              placeholder="What is this account used for?" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 mb-6 text-sm cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded" />
            Account is active
          </label>

          {/* Actions */}
          <div className="flex gap-3">
            {onDelete && (
              <button onClick={() => onDelete(account!.id)}
                className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete
              </button>
            )}
            <div className="flex-1" />
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-border text-sm">Cancel</button>
            <button onClick={handleSave} disabled={!code || !name}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-40">
              {isEdit ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
