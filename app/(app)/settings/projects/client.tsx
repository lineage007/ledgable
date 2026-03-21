"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X, Check, FolderOpen, Briefcase } from "lucide-react"

type Project = {
  id: string; code: string; name: string; color: string | null; llm_prompt: string | null;
  isEditable: boolean; isDeletable: boolean;
}

const COLORS = [
  '#16A34A', '#0D9488', '#2563EB', '#7C3AED', '#DB2777',
  '#EA580C', '#D97706', '#65A30D', '#0891B2', '#6366F1',
]

export function ProjectsClient({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [newDesc, setNewDesc] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A2E]">Projects</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Track income and expenses by project or business activity</p>
        </div>
        <button onClick={() => { setShowAdd(true); setNewName(''); setNewDesc(''); setNewColor(COLORS[Math.floor(Math.random() * COLORS.length)]) }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E] transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Search */}
      {projects.length > 3 && (
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" />
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-[#0D9488]/30 bg-[#0D9488]/5 p-4 my-4">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">New Project</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setNewColor(c)}
                    className={`w-6 h-6 rounded-full transition-all ${newColor === c ? 'ring-2 ring-[#0D9488] ring-offset-2' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name (e.g. Freelancing, YouTube Channel)"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none" autoFocus />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Brief description (optional)"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] outline-none text-[#6B7280]" />
            <div className="flex gap-2">
              <button onClick={() => { if (newName.trim()) handleAdd() }}
                className="px-4 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E]">Create Project</button>
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      {filtered.length === 0 && !showAdd && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[#F1F3F5] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-[#9CA3AF]" />
          </div>
          <h3 className="font-semibold text-[#1A1A2E] mb-1">No projects yet</h3>
          <p className="text-sm text-[#9CA3AF] max-w-xs mx-auto">Projects help you separate financials by business activity. Create one to get started.</p>
          <button onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0F766E]">
            Create your first project
          </button>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {filtered.map(proj => (
          <div key={proj.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition-colors group">
            {editId === proj.id ? (
              <>
                <div className="flex gap-1 shrink-0">
                  {COLORS.slice(0, 6).map(c => (
                    <button key={c} onClick={() => setEditColor(c)}
                      className={`w-5 h-5 rounded-full ${editColor === c ? 'ring-2 ring-[#0D9488] ring-offset-1' : ''}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg border border-[#0D9488] text-sm outline-none" autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleEdit(proj.id)} />
                <button onClick={() => handleEdit(proj.id)} className="text-[#0D9488]"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditId(null)} className="text-[#9CA3AF]"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${proj.color || '#9CA3AF'}15` }}>
                  <FolderOpen className="w-4.5 h-4.5" style={{ color: proj.color || '#9CA3AF' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#1A1A2E]">{proj.name}</span>
                  {proj.llm_prompt && <p className="text-xs text-[#9CA3AF] truncate">{proj.llm_prompt}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditId(proj.id); setEditName(proj.name); setEditColor(proj.color || '#9CA3AF') }}
                    className="p-1.5 rounded-lg hover:bg-[#F1F3F5] text-[#9CA3AF] hover:text-[#6B7280]"><Pencil className="w-3.5 h-3.5" /></button>
                  {proj.isDeletable && (
                    <button onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {projects.length > 0 && (
        <p className="text-xs text-[#9CA3AF] mt-4">{projects.length} {projects.length === 1 ? 'project' : 'projects'} • Assign transactions to projects for separate reporting</p>
      )}
    </div>
  )

  function handleAdd() {
    const newProj: Project = {
      id: crypto.randomUUID(), code: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName.trim(), color: newColor, llm_prompt: newDesc || null,
      isEditable: true, isDeletable: true,
    }
    setProjects([...projects, newProj])
    setNewName(''); setNewDesc(''); setShowAdd(false)
  }

  function handleEdit(id: string) {
    setProjects(projects.map(p => p.id === id ? { ...p, name: editName, color: editColor } : p))
    setEditId(null)
  }

  function handleDelete(id: string) {
    setProjects(projects.filter(p => p.id !== id))
  }
}
