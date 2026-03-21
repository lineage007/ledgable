"use client"

import { useState } from "react"
import Link from "next/link"

type Invoice = {
  id: string; number: string; client: string; amount: number; status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string; dueDate: string; email: string;
}

const DEMO_INVOICES: Invoice[] = []

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(DEMO_INVOICES)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ client: '', email: '', items: [{ desc: '', qty: 1, rate: 0 }], notes: '', due: 14, gst: true })

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.rate, 0)
  const gst = form.gst ? subtotal * 0.1 : 0
  const total = subtotal + gst

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { desc: '', qty: 1, rate: 0 }] }))
  const updateItem = (idx: number, key: string, val: string | number) => {
    const items = [...form.items]
    items[idx] = { ...items[idx], [key]: val }
    setForm(f => ({ ...f, items }))
  }

  if (showCreate) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => setShowCreate(false)} className="text-sm text-muted-foreground hover:text-foreground mb-1">← Back to Invoices</button>
          <h1 className="text-2xl font-bold">New Invoice</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">Save Draft</button>
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">Send Invoice</button>
        </div>
      </div>

      {/* Invoice Form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Client Name</label>
            <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Business or person name" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Client Email</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="invoice@client.com" />
          </div>
        </div>

        {/* Payment Terms */}
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Payment Terms</label>
            <select value={form.due} onChange={e => setForm(f => ({ ...f, due: +e.target.value }))}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
              <option value={7}>Net 7</option>
              <option value={14}>Net 14</option>
              <option value={30}>Net 30</option>
              <option value={60}>Net 60</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.gst} onChange={e => setForm(f => ({ ...f, gst: e.target.checked }))} className="rounded" />
              Include GST (10%)
            </label>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Line Items</label>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground px-1">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)}
                  className="col-span-6 px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Item description" />
                <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', +e.target.value)}
                  className="col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-center" />
                <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', +e.target.value)}
                  className="col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-right" placeholder="0.00" />
                <div className="col-span-2 flex items-center justify-end font-mono text-sm">
                  ${(item.qty * item.rate).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-2 text-sm text-emerald-400 hover:text-emerald-300">+ Add line item</button>
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
              {form.gst && <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (10%)</span><span className="font-mono">${gst.toFixed(2)}</span></div>}
              <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                <span>Total</span><span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm h-20 resize-none" placeholder="Payment instructions, thank you note, etc." />
        </div>
      </div>

      {/* Live Preview */}
      <div className="mt-6 rounded-xl border border-border bg-card p-8">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Preview</div>
        <div className="bg-white text-gray-900 rounded-lg p-8 max-w-2xl mx-auto shadow-lg">
          <div className="flex justify-between mb-8">
            <div>
              <div className="text-2xl font-bold text-emerald-600">INVOICE</div>
              <div className="text-sm text-gray-500 mt-1">INV-0001</div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Your Business Name</div>
              <div>ABN: 00 000 000 000</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-sm text-gray-500">Bill to:</div>
            <div className="font-medium">{form.client || 'Client Name'}</div>
            <div className="text-sm text-gray-500">{form.email || 'client@email.com'}</div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-normal">Description</th>
              <th className="text-center py-2 text-gray-500 font-normal">Qty</th>
              <th className="text-right py-2 text-gray-500 font-normal">Rate</th>
              <th className="text-right py-2 text-gray-500 font-normal">Amount</th>
            </tr></thead>
            <tbody>
              {form.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">{item.desc || '—'}</td>
                  <td className="py-2 text-center">{item.qty}</td>
                  <td className="py-2 text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-2 text-right">${(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-48 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {form.gst && <div className="flex justify-between"><span className="text-gray-500">GST</span><span>${gst.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-1">
                <span>Total AUD</span><span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {form.notes && <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">{form.notes}</div>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">Create and manage professional invoices</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors">
          + New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MiniStat label="Draft" value="$0" count={0} color="gray" />
        <MiniStat label="Sent" value="$0" count={0} color="blue" />
        <MiniStat label="Paid" value="$0" count={0} color="emerald" />
        <MiniStat label="Overdue" value="$0" count={0} color="red" />
      </div>

      {/* Invoice List */}
      <div className="rounded-xl border border-border bg-card">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first professional invoice in seconds</p>
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <StatusBadge status={inv.status} />
                  <div>
                    <div className="font-medium">{inv.client}</div>
                    <div className="text-xs text-muted-foreground">{inv.number} · {inv.date}</div>
                  </div>
                </div>
                <div className="font-mono font-medium">${inv.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value, count, color }: { label: string; value: string; count: number; color: string }) {
  const bg: Record<string, string> = { gray: 'bg-gray-500/10', blue: 'bg-blue-500/10', emerald: 'bg-emerald-500/10', red: 'bg-red-500/10' }
  return (
    <div className={`rounded-lg p-3 ${bg[color] || bg.gray}`}>
      <div className="text-xs text-muted-foreground">{label} ({count})</div>
      <div className="font-mono font-bold mt-1">{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    sent: 'bg-blue-500/20 text-blue-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    overdue: 'bg-red-500/20 text-red-400',
  }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>{status}</span>
}
