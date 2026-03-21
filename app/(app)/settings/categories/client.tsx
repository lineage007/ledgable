"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X, Check, Tag } from "lucide-react"

type Category = {
  id: string; code: string; name: string; color: string | null; llm_prompt: string | null;
  isEditable: boolean; isDeletable: boolean;
}

const PRESET_COLORS = [
  '#16A34A', '#0D9488', '#2563EB', '#7C3AED', '#DB2777',
  '#EA580C', '#D97706', '#65A30D', '#0891B2', '#6366F1',
  '#E11D48', '#78716C',
]

const SUGGESTED = [
  { name: 'Advertising & Marketing', color: '#EA580C', hint: 'Social media ads, Google Ads, print, sponsorships' },
  { name: 'Bank Fees', color: '#78716C', hint: 'Monthly fees, transaction charges, merchant fees' },
  { name: 'Contractor Payments', color: '#7C3AED', hint: 'Subcontractor invoices, freelancer payments' },
  { name: 'Equipment & Tools', color: '#2563EB', hint: 'Hardware, tools, small equipment under $1000' },
  { name: 'Insurance', color: '#0891B2', hint: 'Business insurance, professional indemnity, workers comp' },
  { name: 'Meals & Entertainment', color: '#DB2777', hint: 'Client lunches, team dinners, entertainment' },
  { name: 'Motor Vehicle', color: '#D97706', hint: 'Fuel, tolls, parking, car maintenance, registration' },
  { name: 'Office Supplies', color: '#65A30D', hint: 'Stationery, printer ink, postage, small office items' },
  { name: 'Rent & Utilities', color: '#16A34A', hint: 'Office rent, electricity, water, internet, phone' },
  { name: 'Software & Subscriptions', color: '#6366F1', hint: 'SaaS tools, software licences, cloud services' },
  { name: 'Travel', color: '#0D9488', hint: 'Flights, accommodation, car hire, travel meals' },
  { name: 'Professional Services', color: '#E11D48', hint: 'Accountant, lawyer, consultant fees' },
]

export function CategoriesClient({ categories: initial, userId }: { categories: Category[]; userId: string }) {
  const [categories, setCategories] = useState(initial)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const existingNames = new Set(categories.map(c => c.name.toLowerCase()))
  const suggestions = SUGGESTED.filter(s => !existingNames.has(s.name.toLowerCase()))

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Categories</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Organise your income and expenses</p>
        </div>
        <button onClick={() => { setShowAdd(true); setNewName(''); setNewColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]) }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E] transition-colors">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Search */}
      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" />
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-[#0D9488]/30 bg-[#0D9488]/5 p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0">
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full transition-all ${newColor === c ? 'ring-2 ring-[#0D9488] ring-offset-2' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: newColor }} />
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name"
              className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none"
              autoFocus onKeyDown={e => e.key === 'Enter' && newName.trim() && handleAdd()} />
            <button onClick={() => newName.trim() && handleAdd()}
              className="px-3 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E]">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && categories.length < 5 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 mb-4">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">💡 Suggested for Australian businesses</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map(s => (
              <button key={s.name} onClick={() => quickAdd(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-xs font-medium text-[#374151] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9CA3AF]">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{search ? 'No matching categories' : 'No categories yet'}</p>
          </div>
        )}
        {filtered.map(cat => (
          <div key={cat.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition-colors group">
            {editId === cat.id ? (
              <>
                <div className="flex gap-1 shrink-0">
                  {PRESET_COLORS.slice(0, 6).map(c => (
                    <button key={c} onClick={() => setEditColor(c)}
                      className={`w-5 h-5 rounded-full ${editColor === c ? 'ring-2 ring-[#0D9488] ring-offset-1' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg border border-[#0D9488] text-sm outline-none" autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleEdit(cat.id)} />
                <button onClick={() => handleEdit(cat.id)} className="text-[#0D9488] hover:text-[#0F766E]"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditId(null)} className="text-[#9CA3AF] hover:text-[#6B7280]"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#9CA3AF' }} />
                <span className="flex-1 text-sm font-medium text-[#1A1A2E]">{cat.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditColor(cat.color || '#9CA3AF') }}
                    className="p-1.5 rounded-lg hover:bg-[#F1F3F5] text-[#9CA3AF] hover:text-[#6B7280]"><Pencil className="w-3.5 h-3.5" /></button>
                  {cat.isDeletable && (
                    <button onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[#9CA3AF] mt-4">{categories.length} {categories.length === 1 ? 'category' : 'categories'} • Ledge AI uses categories to automatically sort your receipts</p>
    </div>
  )

  async function handleAdd() {
    // For now, optimistic — server action would go here
    const newCat: Category = {
      id: crypto.randomUUID(), code: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName.trim(), color: newColor, llm_prompt: null,
      isEditable: true, isDeletable: true,
    }
    setCategories([...categories, newCat])
    setNewName(''); setShowAdd(false)
  }

  async function quickAdd(s: typeof SUGGESTED[0]) {
    const newCat: Category = {
      id: crypto.randomUUID(), code: s.name.toLowerCase().replace(/\s+/g, '-'),
      name: s.name, color: s.color, llm_prompt: s.hint,
      isEditable: true, isDeletable: true,
    }
    setCategories([...categories, newCat])
  }

  async function handleEdit(id: string) {
    setCategories(categories.map(c => c.id === id ? { ...c, name: editName, color: editColor } : c))
    setEditId(null)
  }

  async function handleDelete(id: string) {
    setCategories(categories.filter(c => c.id !== id))
  }
}
