"use client"

import { useState } from "react"
import { Plus, Eye, EyeOff, GripVertical, List, Trash2, Check, X, Lock, ToggleLeft, ToggleRight } from "lucide-react"

type Field = {
  id: string; code: string; name: string; type: string;
  llm_prompt: string | null; isVisibleInList: boolean; isVisibleInAnalysis: boolean;
  isRequired: boolean; isExtra: boolean;
  isEditable: boolean; isDeletable: boolean;
}

const FIELD_TYPES = [
  { value: 'string', label: 'Text', icon: '📝' },
  { value: 'number', label: 'Number', icon: '#️⃣' },
  { value: 'boolean', label: 'Yes / No', icon: '✅' },
]

export function FieldsClient({ fields: initial }: { fields: Field[] }) {
  const [fields, setFields] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('string')

  const standardFields = fields.filter(f => !f.isExtra)
  const customFields = fields.filter(f => f.isExtra)

  const toggleField = (id: string, key: 'isVisibleInList' | 'isVisibleInAnalysis' | 'isRequired') => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: !f[key] } : f))
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Transaction Fields</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Choose what information to track on each transaction</p>
        </div>
        <button onClick={() => { setShowAdd(true); setNewName(''); setNewType('string') }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E] transition-colors">
          <Plus className="w-4 h-4" /> Add Field
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 my-4 text-xs text-[#9CA3AF]">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Show in table</span>
        <span className="flex items-center gap-1"><List className="w-3 h-3" /> Show in form</span>
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Required</span>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-[#0D9488]/30 bg-[#0D9488]/5 p-4 mb-4">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">New Custom Field</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1 block">Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Project Code, Client Reference"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" autoFocus />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1 block">Type</label>
              <div className="flex gap-1">
                {FIELD_TYPES.map(t => (
                  <button key={t.value} onClick={() => setNewType(t.value)}
                    className={`px-3 py-2.5 rounded-xl border text-sm transition-all ${newType === t.value
                      ? 'border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488] font-medium'
                      : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]'}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { if (newName.trim()) handleAdd() }}
              className="px-4 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E]">Add Field</button>
            <button onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB]">Cancel</button>
          </div>
        </div>
      )}

      {/* Standard fields */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Standard Fields
        </p>
        <div className="rounded-xl border border-[#E5E7EB] bg-white divide-y divide-[#F1F3F5]">
          {standardFields.map(field => (
            <FieldRow key={field.id} field={field} onToggle={toggleField} onDelete={null} />
          ))}
        </div>
      </div>

      {/* Custom fields */}
      {customFields.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Custom Fields</p>
          <div className="rounded-xl border border-[#E5E7EB] bg-white divide-y divide-[#F1F3F5]">
            {customFields.map(field => (
              <FieldRow key={field.id} field={field} onToggle={toggleField} onDelete={(id) => setFields(fields.filter(f => f.id !== id))} />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-[#9CA3AF] mt-4">
        {fields.length} fields ({standardFields.length} standard + {customFields.length} custom) • Toggle visibility to control what appears in tables and forms
      </p>
    </div>
  )

  function handleAdd() {
    const newField: Field = {
      id: crypto.randomUUID(), code: newName.toLowerCase().replace(/\s+/g, '_'),
      name: newName.trim(), type: newType, llm_prompt: null,
      isVisibleInList: true, isVisibleInAnalysis: true, isRequired: false, isExtra: true,
      isEditable: true, isDeletable: true,
    }
    setFields([...fields, newField])
    setNewName(''); setShowAdd(false)
  }
}

function FieldRow({ field, onToggle, onDelete }: {
  field: Field;
  onToggle: (id: string, key: 'isVisibleInList' | 'isVisibleInAnalysis' | 'isRequired') => void;
  onDelete: ((id: string) => void) | null;
}) {
  const typeInfo = { string: { label: 'Text', color: '#2563EB' }, number: { label: 'Number', color: '#D97706' }, boolean: { label: 'Yes/No', color: '#16A34A' } }
  const t = typeInfo[field.type as keyof typeof typeInfo] || typeInfo.string

  return (
    <div className="flex items-center gap-3 px-4 py-3 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1A1A2E]">{field.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${t.color}15`, color: t.color }}>{t.label}</span>
          {!field.isExtra && <Lock className="w-3 h-3 text-[#D1D5DB]" />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ToggleBtn active={field.isVisibleInList} onClick={() => onToggle(field.id, 'isVisibleInList')} icon={<Eye className="w-3.5 h-3.5" />} title="Show in table" />
        <ToggleBtn active={field.isVisibleInAnalysis} onClick={() => onToggle(field.id, 'isVisibleInAnalysis')} icon={<List className="w-3.5 h-3.5" />} title="Show in form" />
        <ToggleBtn active={field.isRequired} onClick={() => onToggle(field.id, 'isRequired')} icon={<Check className="w-3.5 h-3.5" />} title="Required" />
        {onDelete && field.isDeletable && (
          <button onClick={() => onDelete(field.id)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function ToggleBtn({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string }) {
  return (
    <button onClick={onClick} title={title}
      className={`p-1.5 rounded-lg transition-all ${active ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'text-[#D1D5DB] hover:text-[#9CA3AF] hover:bg-[#F1F3F5]'}`}>
      {icon}
    </button>
  )
}
