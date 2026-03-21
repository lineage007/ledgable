"use client"

import { useState, useMemo } from "react"
import { Plus, Search, FileText, Send, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Filter } from "lucide-react"
import Link from "next/link"

type InvoiceRow = {
  id: string; type: 'ACCREC' | 'ACCPAY'; invoiceNumber: string; reference: string;
  contactName: string; date: string; dueDate: string;
  status: 'draft' | 'submitted' | 'authorised' | 'paid' | 'voided' | 'overdue';
  total: number; amountDue: number; amountPaid: number; currency: string;
}

const STATUS_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  draft:      { label: 'Draft',      icon: <FileText className="w-3 h-3" />,    color: 'text-zinc-400',   bg: 'bg-zinc-500/10' },
  submitted:  { label: 'Sent',       icon: <Send className="w-3 h-3" />,        color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  authorised: { label: 'Approved',   icon: <CheckCircle className="w-3 h-3" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  paid:       { label: 'Paid',       icon: <CheckCircle className="w-3 h-3" />, color: 'text-emerald-500', bg: 'bg-emerald-500/15' },
  voided:     { label: 'Voided',     icon: <XCircle className="w-3 h-3" />,     color: 'text-red-400',    bg: 'bg-red-500/10' },
  overdue:    { label: 'Overdue',    icon: <AlertCircle className="w-3 h-3" />, color: 'text-red-500',    bg: 'bg-red-500/15' },
}

const DEMO_INVOICES: InvoiceRow[] = [
  { id: '1', type: 'ACCREC', invoiceNumber: 'INV-0001', reference: 'PO-4523',
    contactName: 'Acme Construction Pty Ltd', date: '2026-03-01', dueDate: '2026-03-31',
    status: 'authorised', total: 8250.00, amountDue: 8250.00, amountPaid: 0, currency: 'AUD' },
  { id: '2', type: 'ACCREC', invoiceNumber: 'INV-0002', reference: '',
    contactName: 'Harbour View Restaurant', date: '2026-02-15', dueDate: '2026-03-01',
    status: 'overdue', total: 3200.00, amountDue: 3200.00, amountPaid: 0, currency: 'AUD' },
  { id: '3', type: 'ACCREC', invoiceNumber: 'INV-0003', reference: '',
    contactName: 'Acme Construction Pty Ltd', date: '2026-03-10', dueDate: '2026-04-09',
    status: 'draft', total: 4250.00, amountDue: 4250.00, amountPaid: 0, currency: 'AUD' },
  { id: '4', type: 'ACCREC', invoiceNumber: 'INV-0004', reference: '',
    contactName: 'Harbour View Restaurant', date: '2026-01-20', dueDate: '2026-02-03',
    status: 'paid', total: 5700.00, amountDue: 0, amountPaid: 5700.00, currency: 'AUD' },
  { id: '5', type: 'ACCPAY', invoiceNumber: 'BILL-0001', reference: 'SUP-INV-8923',
    contactName: 'Melbourne Office Supplies', date: '2026-03-05', dueDate: '2026-03-19',
    status: 'authorised', total: 2340.00, amountDue: 2340.00, amountPaid: 0, currency: 'AUD' },
  { id: '6', type: 'ACCPAY', invoiceNumber: 'BILL-0002', reference: '',
    contactName: 'Sarah Chen - Freelance Design', date: '2026-03-12', dueDate: '2026-03-19',
    status: 'paid', total: 4400.00, amountDue: 0, amountPaid: 4400.00, currency: 'AUD' },
  { id: '7', type: 'ACCPAY', invoiceNumber: 'BILL-0003', reference: 'MOS-2026-001',
    contactName: 'Melbourne Office Supplies', date: '2026-02-10', dueDate: '2026-02-24',
    status: 'overdue', total: 780.00, amountDue: 780.00, amountPaid: 0, currency: 'AUD' },
]

export default function InvoiceListPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'ACCREC' | 'ACCPAY'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return DEMO_INVOICES.filter(inv => {
      if (typeFilter !== 'all' && inv.type !== typeFilter) return false
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return inv.invoiceNumber.toLowerCase().includes(q) || inv.contactName.toLowerCase().includes(q) ||
          inv.reference.toLowerCase().includes(q)
      }
      return true
    })
  }, [search, typeFilter, statusFilter])

  const totalOutstanding = DEMO_INVOICES.filter(i => i.type === 'ACCREC').reduce((s, i) => s + i.amountDue, 0)
  const totalOverdue = DEMO_INVOICES.filter(i => i.type === 'ACCREC' && i.status === 'overdue').reduce((s, i) => s + i.amountDue, 0)
  const totalOwed = DEMO_INVOICES.filter(i => i.type === 'ACCPAY').reduce((s, i) => s + i.amountDue, 0)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices & Bills</h1>
          <p className="text-sm text-muted-foreground">Manage sales invoices and purchase bills</p>
        </div>
        <Link href="/invoices/create"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding Invoices</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground mt-1">Owed to you</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Overdue</div>
          <div className="text-2xl font-bold mt-1 text-red-500">${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground mt-1">Past due date — chase these</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Bills to Pay</div>
          <div className="text-2xl font-bold mt-1 text-amber-500">${totalOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-muted-foreground mt-1">You owe suppliers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm"
            placeholder="Search by invoice #, contact, or reference..." />
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {([['all', 'All'], ['ACCREC', 'Invoices'], ['ACCPAY', 'Bills']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTypeFilter(k as typeof typeFilter)}
              className={`px-4 py-2 text-sm ${typeFilter === k ? 'bg-emerald-600 text-white' : 'bg-card hover:bg-accent'}`}>
              {l}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm">
          <option value="all">All statuses</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Invoice rows */}
      <div className="space-y-2">
        {filtered.map(inv => {
          const meta = STATUS_META[inv.status]
          return (
            <div key={inv.id}
              className="rounded-xl border border-border bg-card px-5 py-3.5 hover:border-emerald-500/30 cursor-pointer transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  inv.type === 'ACCREC' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                }`}>
                  <FileText className={`w-4 h-4 ${inv.type === 'ACCREC' ? 'text-emerald-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <span className="font-mono">{inv.invoiceNumber}</span>
                    {inv.reference && <span className="text-xs text-muted-foreground">ref: {inv.reference}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{inv.contactName}</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {new Date(inv.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    {' → '}
                    {new Date(inv.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${meta.color} ${meta.bg}`}>
                  {meta.icon} {meta.label}
                </span>
                <div className="text-right w-28">
                  <div className="font-mono text-sm font-semibold">${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  {inv.amountDue > 0 && inv.amountDue < inv.total && (
                    <div className="text-[10px] text-muted-foreground">Due: ${inv.amountDue.toFixed(2)}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first invoice to get started</p>
            <Link href="/invoices/create"
              className="inline-flex px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
              Create Invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
