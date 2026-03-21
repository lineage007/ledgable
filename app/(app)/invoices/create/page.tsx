"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Sparkles, Search, X, Send, Download, Eye, Save, ChevronDown } from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────────
type Contact = {
  id: string; name: string; abn?: string; email?: string;
  billingAddress?: { street?: string; city?: string; state?: string; postcode?: string };
  paymentTermsDays: number; salesTaxType?: string;
}

type AccountOption = { code: string; name: string; type: string; taxType: string }

type LineItem = {
  id: string; description: string; quantity: number; unitAmount: number;
  accountCode: string; taxType: string; discountRate: number;
  lineAmount: number; taxAmount: number;
}

type InvoiceData = {
  type: 'ACCREC' | 'ACCPAY'; invoiceNumber: string; reference: string;
  contact: Contact | null; date: string; dueDate: string;
  lineAmountTypes: 'Exclusive' | 'Inclusive' | 'NoTax';
  lineItems: LineItem[]; notes: string; terms: string;
  subtotal: number; totalTax: number; total: number;
}

// ─── Demo Data ──────────────────────────────────────────────
const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'Acme Construction Pty Ltd', abn: '51 824 753 556', email: 'accounts@acmeconstruction.com.au',
    billingAddress: { street: '42 Collins St', city: 'Melbourne', state: 'VIC', postcode: '3000' },
    paymentTermsDays: 30, salesTaxType: 'GST' },
  { id: '2', name: 'Melbourne Office Supplies', abn: '23 456 789 012', email: 'orders@melboffice.com.au',
    paymentTermsDays: 14 },
  { id: '3', name: 'Harbour View Restaurant', abn: '67 890 123 456', email: 'manager@harbourview.com.au',
    billingAddress: { street: '88 Circular Quay', city: 'Sydney', state: 'NSW', postcode: '2000' },
    paymentTermsDays: 14, salesTaxType: 'GST' },
  { id: '4', name: 'Sarah Chen - Freelance Design', abn: '98 765 432 100', email: 'sarah@chendesign.com.au',
    paymentTermsDays: 7 },
]

const ACCOUNTS: AccountOption[] = [
  { code: '400', name: 'Sales Revenue', type: 'revenue', taxType: 'GST' },
  { code: '410', name: 'Service Revenue', type: 'revenue', taxType: 'GST' },
  { code: '420', name: 'Interest Income', type: 'revenue', taxType: 'FRE' },
  { code: '430', name: 'Other Revenue', type: 'revenue', taxType: 'GST' },
  { code: '500', name: 'Cost of Goods Sold', type: 'expense', taxType: 'GST' },
  { code: '600', name: 'Advertising & Marketing', type: 'expense', taxType: 'GST' },
  { code: '630', name: 'Consulting & Accounting', type: 'expense', taxType: 'GST' },
  { code: '700', name: 'Office Expenses', type: 'expense', taxType: 'GST' },
  { code: '710', name: 'Rent', type: 'expense', taxType: 'GST' },
]

const ITEMS = [
  { code: 'CONSULT-HR', name: 'Consulting - Hourly', salePrice: 150, account: '410', tax: 'GST' },
  { code: 'CONSULT-DAY', name: 'Consulting - Full Day', salePrice: 1200, account: '410', tax: 'GST' },
  { code: 'DEV-HR', name: 'Development - Hourly', salePrice: 180, account: '410', tax: 'GST' },
  { code: 'DESIGN-HR', name: 'Design - Hourly', salePrice: 120, account: '410', tax: 'GST' },
  { code: 'HOSTING', name: 'Website Hosting (Monthly)', salePrice: 49, account: '400', tax: 'GST' },
  { code: 'SUPPORT', name: 'Support Package (Monthly)', salePrice: 299, account: '400', tax: 'GST' },
]

const TAX_RATES: Record<string, number> = { 'GST': 10, 'FRE': 0, 'INP': 0, 'EXP': 0, 'BAS': 0, 'CAP': 10 }

// ─── Helpers ────────────────────────────────────────────────
function newLine(): LineItem {
  return { id: Date.now().toString() + Math.random(), description: '', quantity: 1, unitAmount: 0,
    accountCode: '400', taxType: 'GST', discountRate: 0, lineAmount: 0, taxAmount: 0 }
}

function calcLine(line: LineItem, amountType: string): LineItem {
  const gross = line.quantity * line.unitAmount
  const discounted = gross * (1 - line.discountRate / 100)
  const rate = TAX_RATES[line.taxType] || 0

  if (amountType === 'Inclusive') {
    const taxAmount = discounted - (discounted / (1 + rate / 100))
    return { ...line, lineAmount: discounted, taxAmount: Math.round(taxAmount * 100) / 100 }
  } else if (amountType === 'Exclusive') {
    const taxAmount = discounted * (rate / 100)
    return { ...line, lineAmount: discounted, taxAmount: Math.round(taxAmount * 100) / 100 }
  } else {
    return { ...line, lineAmount: discounted, taxAmount: 0 }
  }
}

function today() { return new Date().toISOString().slice(0, 10) }
function addDays(d: string, n: number) {
  const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10)
}

// ─── Main Create Invoice Page ────────────────────────────────
export default function CreateInvoicePage() {
  const [inv, setInv] = useState<InvoiceData>({
    type: 'ACCREC', invoiceNumber: 'INV-0001', reference: '',
    contact: null, date: today(), dueDate: addDays(today(), 30),
    lineAmountTypes: 'Exclusive',
    lineItems: [newLine()], notes: '', terms: 'Payment due within terms specified.',
    subtotal: 0, totalTax: 0, total: 0,
  })
  const [contactSearch, setContactSearch] = useState('')
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [itemSearch, setItemSearch] = useState<string | null>(null) // line ID being searched
  const [ledgeMessages, setLedgeMessages] = useState<string[]>([])
  const contactRef = useRef<HTMLDivElement>(null)

  // Recalc totals whenever lines change
  const totals = useMemo(() => {
    const lines = inv.lineItems.map(l => calcLine(l, inv.lineAmountTypes))
    const subtotal = lines.reduce((s, l) => s + l.lineAmount, 0)
    const totalTax = lines.reduce((s, l) => s + l.taxAmount, 0)
    const total = inv.lineAmountTypes === 'Inclusive' ? subtotal : subtotal + totalTax
    return { subtotal, totalTax, total, lines }
  }, [inv.lineItems, inv.lineAmountTypes])

  // Contact selection
  const filteredContacts = useMemo(() => {
    if (!contactSearch) return DEMO_CONTACTS
    const q = contactSearch.toLowerCase()
    return DEMO_CONTACTS.filter(c =>
      c.name.toLowerCase().includes(q) || c.abn?.includes(q) || c.email?.toLowerCase().includes(q)
    )
  }, [contactSearch])

  const selectContact = (c: Contact) => {
    setInv(prev => ({
      ...prev, contact: c,
      dueDate: addDays(prev.date, c.paymentTermsDays),
    }))
    setContactSearch('')
    setShowContactDropdown(false)

    const msgs: string[] = []
    if (c.salesTaxType) msgs.push(`Tax defaulted to ${c.salesTaxType} from contact settings`)
    if (c.paymentTermsDays !== 30) msgs.push(`Due date set to Net ${c.paymentTermsDays} (contact preference)`)
    if (c.billingAddress) msgs.push(`Billing address auto-filled from ${c.name}`)
    if (msgs.length) setLedgeMessages(msgs)

    // Auto-set tax on existing lines
    if (c.salesTaxType) {
      setInv(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(l => ({ ...l, taxType: c.salesTaxType || l.taxType }))
      }))
    }
  }

  // Line item manipulation
  const updateLine = (id: string, updates: Partial<LineItem>) => {
    setInv(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(l => l.id === id ? { ...l, ...updates } : l)
    }))
  }

  const addLine = () => setInv(prev => ({ ...prev, lineItems: [...prev.lineItems, newLine()] }))

  const removeLine = (id: string) => {
    setInv(prev => ({
      ...prev,
      lineItems: prev.lineItems.length > 1 ? prev.lineItems.filter(l => l.id !== id) : prev.lineItems
    }))
  }

  // Quick-add from items catalog
  const addFromItem = (lineId: string, item: typeof ITEMS[0]) => {
    updateLine(lineId, {
      description: item.name,
      unitAmount: item.salePrice,
      accountCode: item.account,
      taxType: item.tax,
    })
    setItemSearch(null)
    setLedgeMessages([`✅ Added "${item.name}" — $${item.salePrice}/unit, account ${item.account}`])
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setShowContactDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/invoices" className="p-2 rounded-lg hover:bg-accent">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {inv.type === 'ACCREC' ? 'New Invoice' : 'New Bill'}
          </h1>
        </div>
        {/* Type toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setInv(p => ({ ...p, type: 'ACCREC' }))}
            className={`px-3 py-1.5 text-xs font-medium ${inv.type === 'ACCREC' ? 'bg-emerald-600 text-white' : 'bg-card'}`}>
            Invoice (Sales)
          </button>
          <button onClick={() => setInv(p => ({ ...p, type: 'ACCPAY' }))}
            className={`px-3 py-1.5 text-xs font-medium ${inv.type === 'ACCPAY' ? 'bg-amber-600 text-white' : 'bg-card'}`}>
            Bill (Purchase)
          </button>
        </div>
      </div>

      {/* Ledge AI messages */}
      {ledgeMessages.length > 0 && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400">Ledge</span>
            <button onClick={() => setLedgeMessages([])} className="ml-auto"><X className="w-3 h-3 text-violet-400" /></button>
          </div>
          {ledgeMessages.map((m, i) => (
            <div key={i} className="text-sm text-violet-300">• {m}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main form (2 cols) */}
        <div className="col-span-2 space-y-5">
          {/* Contact selector */}
          <div ref={contactRef} className="relative">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">
              {inv.type === 'ACCREC' ? 'Bill To (Customer)' : 'From (Supplier)'}
            </label>
            {inv.contact ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div>
                  <div className="font-medium text-sm">{inv.contact.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {inv.contact.abn && `ABN ${inv.contact.abn}`}
                    {inv.contact.email && ` · ${inv.contact.email}`}
                  </div>
                  {inv.contact.billingAddress && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {[inv.contact.billingAddress.street, inv.contact.billingAddress.city,
                        inv.contact.billingAddress.state, inv.contact.billingAddress.postcode].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
                <button onClick={() => setInv(p => ({ ...p, contact: null }))}
                  className="p-1 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={contactSearch}
                  onChange={e => { setContactSearch(e.target.value); setShowContactDropdown(true) }}
                  onFocus={() => setShowContactDropdown(true)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm"
                  placeholder="Search contacts by name, ABN, or email..." />
                {showContactDropdown && (
                  <div className="absolute z-20 w-full mt-1 rounded-xl border border-border bg-card shadow-xl max-h-64 overflow-y-auto">
                    <div className="px-3 py-1.5 bg-violet-500/10 border-b border-border flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span className="text-[11px] text-violet-400 font-medium">Ledge: Select a contact to auto-fill details</span>
                    </div>
                    {filteredContacts.map(c => (
                      <button key={c.id} onClick={() => selectContact(c)}
                        className="w-full px-4 py-3 text-left hover:bg-accent/50 border-b border-border last:border-0">
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.abn && `ABN ${c.abn}`}{c.email && ` · ${c.email}`}
                          {c.billingAddress && ` · ${c.billingAddress.city}, ${c.billingAddress.state}`}
                        </div>
                      </button>
                    ))}
                    {filteredContacts.length === 0 && (
                      <div className="px-4 py-4 text-center">
                        <div className="text-sm text-muted-foreground mb-2">No contacts found</div>
                        <Link href="/contacts" className="text-xs text-emerald-400 hover:underline">+ Create new contact</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invoice details row */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Invoice #</label>
              <input value={inv.invoiceNumber} onChange={e => setInv(p => ({ ...p, invoiceNumber: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Reference</label>
              <input value={inv.reference} onChange={e => setInv(p => ({ ...p, reference: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
                placeholder="PO-1234" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Date</label>
              <input type="date" value={inv.date}
                onChange={e => setInv(p => ({ ...p, date: e.target.value, dueDate: addDays(e.target.value, p.contact?.paymentTermsDays || 30) }))}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Due Date</label>
              <input type="date" value={inv.dueDate}
                onChange={e => setInv(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>

          {/* Tax handling */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Amounts Are</label>
            <div className="flex rounded-lg border border-border overflow-hidden w-fit">
              {(['Exclusive', 'Inclusive', 'NoTax'] as const).map(t => (
                <button key={t} onClick={() => setInv(p => ({ ...p, lineAmountTypes: t }))}
                  className={`px-4 py-2 text-xs font-medium ${inv.lineAmountTypes === t ? 'bg-emerald-600 text-white' : 'bg-card hover:bg-accent'}`}>
                  {t === 'NoTax' ? 'No Tax' : `Tax ${t}`}
                </button>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-accent/30 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              <div className="col-span-4">Description</div>
              <div className="col-span-1 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-1 text-right">Disc %</div>
              <div className="col-span-1">Account</div>
              <div className="col-span-1">Tax</div>
              <div className="col-span-1 text-right">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {inv.lineItems.map((line, idx) => {
              const calc = calcLine(line, inv.lineAmountTypes)
              return (
                <div key={line.id} className="px-4 py-2 grid grid-cols-12 gap-2 items-center border-t border-border group relative">
                  {/* Description with item search */}
                  <div className="col-span-4 relative">
                    <input value={line.description}
                      onChange={e => { updateLine(line.id, { description: e.target.value }); if (e.target.value.length >= 2) setItemSearch(line.id) }}
                      onFocus={() => { if (line.description.length >= 2 || !line.description) setItemSearch(line.id) }}
                      onBlur={() => setTimeout(() => setItemSearch(null), 200)}
                      className="w-full px-2 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-sm"
                      placeholder="Type description or search items..." />
                    {itemSearch === line.id && (
                      <div className="absolute z-30 w-80 mt-1 rounded-xl border border-border bg-card shadow-xl max-h-48 overflow-y-auto">
                        <div className="px-3 py-1.5 bg-violet-500/10 border-b border-border flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          <span className="text-[11px] text-violet-400">Quick-add from your items catalog</span>
                        </div>
                        {ITEMS.filter(it => !line.description || it.name.toLowerCase().includes(line.description.toLowerCase())).map(item => (
                          <button key={item.code} onMouseDown={() => addFromItem(line.id, item)}
                            className="w-full px-3 py-2 text-left hover:bg-accent/50 border-b border-border last:border-0">
                            <div className="flex justify-between">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-mono">${item.salePrice}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{item.code} · Account {item.account}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="number" value={line.quantity} min={0} step={0.01}
                    onChange={e => updateLine(line.id, { quantity: parseFloat(e.target.value) || 0 })}
                    className="col-span-1 px-2 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-sm text-right font-mono" />
                  <input type="number" value={line.unitAmount} min={0} step={0.01}
                    onChange={e => updateLine(line.id, { unitAmount: parseFloat(e.target.value) || 0 })}
                    className="col-span-2 px-2 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-sm text-right font-mono" />
                  <input type="number" value={line.discountRate} min={0} max={100} step={1}
                    onChange={e => updateLine(line.id, { discountRate: parseFloat(e.target.value) || 0 })}
                    className="col-span-1 px-2 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-sm text-right font-mono" />
                  <select value={line.accountCode}
                    onChange={e => updateLine(line.id, { accountCode: e.target.value })}
                    className="col-span-1 px-1 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-[11px]">
                    {ACCOUNTS.filter(a => inv.type === 'ACCREC' ? a.type === 'revenue' : a.type === 'expense').map(a => (
                      <option key={a.code} value={a.code}>{a.code}</option>
                    ))}
                  </select>
                  <select value={line.taxType}
                    onChange={e => updateLine(line.id, { taxType: e.target.value })}
                    className="col-span-1 px-1 py-1.5 rounded border border-transparent hover:border-border focus:border-border bg-transparent text-[11px]">
                    <option value="GST">GST</option>
                    <option value="FRE">FRE</option>
                    <option value="INP">INP</option>
                    <option value="EXP">EXP</option>
                    <option value="BAS">BAS</option>
                  </select>
                  <div className="col-span-1 text-right font-mono text-sm font-medium">
                    ${calc.lineAmount.toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => removeLine(line.id)}
                      className="p-1 rounded text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}

            <button onClick={addLine}
              className="w-full px-4 py-2.5 text-sm text-emerald-500 hover:bg-emerald-500/5 border-t border-border flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Line
            </button>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Notes</label>
              <textarea value={inv.notes} onChange={e => setInv(p => ({ ...p, notes: e.target.value }))} rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                placeholder="Notes to customer (appears on invoice)..." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Terms</label>
              <textarea value={inv.terms} onChange={e => setInv(p => ({ ...p, terms: e.target.value }))} rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                placeholder="Payment terms and conditions..." />
            </div>
          </div>
        </div>

        {/* Right sidebar: Summary + Actions */}
        <div className="space-y-4">
          {/* Totals card */}
          <div className="rounded-xl border border-border bg-card p-5 sticky top-6">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
              </div>
              {inv.lineAmountTypes !== 'NoTax' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST ({inv.lineAmountTypes === 'Inclusive' ? 'included' : 'added'})</span>
                  <span className="font-mono">${totals.totalTax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total AUD</span>
                  <span className="font-mono">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mt-5">
              <button className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save as Draft
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg border border-emerald-500 text-emerald-500 text-sm font-medium hover:bg-emerald-500/10 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Approve & Send
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-accent flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" /> Preview PDF
              </button>
            </div>
          </div>

          {/* Ledge AI card */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Ledge Assistant</span>
            </div>
            <div className="space-y-2 text-xs text-violet-300">
              <div>• Type a contact name to auto-fill their ABN, address & payment terms</div>
              <div>• Type in a line description to search your items catalog</div>
              <div>• Tax rates auto-set from contact preferences</div>
              <div>• Due date calculates from contact&apos;s Net terms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
