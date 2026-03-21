"use client"

import { useState } from "react"

type Platform = 'xero' | 'quickbooks' | 'myob' | 'csv'
type Step = 'choose' | 'connect' | 'mapping' | 'review' | 'importing' | 'done'

const PLATFORMS = [
  { id: 'xero' as Platform, name: 'Xero', icon: '🔵', desc: 'Import chart of accounts, invoices, bills, contacts, and bank transactions via OAuth2', connected: false },
  { id: 'quickbooks' as Platform, name: 'QuickBooks Online', icon: '🟢', desc: 'Import all financial data including payroll, inventory, and custom reports', connected: false },
  { id: 'myob' as Platform, name: 'MYOB', icon: '🟣', desc: 'Import AU-specific data including GST codes, BAS data, and superannuation', connected: false },
  { id: 'csv' as Platform, name: 'CSV / Manual', icon: '📄', desc: 'Upload exported CSV files from any accounting platform', connected: false },
]

const DATA_TYPES = [
  { id: 'accounts', label: 'Chart of Accounts', icon: '📊', count: 0, selected: true },
  { id: 'contacts', label: 'Contacts (Customers & Suppliers)', icon: '👥', count: 0, selected: true },
  { id: 'invoices', label: 'Invoices', icon: '📄', count: 0, selected: true },
  { id: 'bills', label: 'Bills & Expenses', icon: '📋', count: 0, selected: true },
  { id: 'transactions', label: 'Bank Transactions', icon: '🏦', count: 0, selected: true },
  { id: 'journals', label: 'Journal Entries', icon: '📝', count: 0, selected: false },
  { id: 'payroll', label: 'Payroll Records', icon: '💰', count: 0, selected: false },
  { id: 'inventory', label: 'Inventory Items', icon: '📦', count: 0, selected: false },
]

export default function MigratePage() {
  const [step, setStep] = useState<Step>('choose')
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [dataTypes, setDataTypes] = useState(DATA_TYPES)
  const [progress, setProgress] = useState(0)

  const toggleData = (id: string) => setDataTypes(d => d.map(t => t.id === id ? { ...t, selected: !t.selected } : t))

  const startImport = () => {
    setStep('importing')
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(() => setStep('done'), 500) }
      setProgress(Math.min(p, 100))
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {['choose', 'connect', 'mapping', 'review', 'done'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              ['choose', 'connect', 'mapping', 'review', 'importing', 'done'].indexOf(step) >= i
                ? 'bg-emerald-600 text-white' : 'bg-accent text-muted-foreground'
            }`}>{i + 1}</div>
            <span className="text-xs text-muted-foreground hidden md:inline">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            {i < 4 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Platform */}
      {step === 'choose' && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Import Your Data</h1>
          <p className="text-muted-foreground mb-6">Choose where you're migrating from. We'll handle the rest.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => { setPlatform(p.id); setStep('connect') }}
                className={`text-left rounded-xl border p-5 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 ${
                  platform === p.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'
                }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-semibold">{p.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Connect */}
      {step === 'connect' && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Connect to {PLATFORMS.find(p => p.id === platform)?.name}</h1>
          <p className="text-muted-foreground mb-6">Authorize Ledgable to read your financial data. We only need read access — we never modify your existing data.</p>
          
          {platform === 'csv' ? (
            <div className="rounded-xl border-2 border-dashed border-border p-12 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="font-semibold mb-2">Upload CSV Files</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to upload exported CSV files</p>
              <button onClick={() => setStep('mapping')} className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
                Choose Files
              </button>
              <p className="text-xs text-muted-foreground mt-4">Supported: Transactions, Contacts, Chart of Accounts, Invoices</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="text-5xl mb-4">{PLATFORMS.find(p => p.id === platform)?.icon}</div>
              <h3 className="font-semibold mb-2">Authorize Access</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You'll be redirected to {PLATFORMS.find(p => p.id === platform)?.name} to authorize read-only access.
                Your credentials are never stored by Ledgable.
              </p>
              <button onClick={() => setStep('mapping')} className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500">
                Connect {PLATFORMS.find(p => p.id === platform)?.name}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>🔒</span> <span>Read-only access · OAuth2 secured · Disconnect anytime</span>
              </div>
            </div>
          )}

          <button onClick={() => setStep('choose')} className="mt-4 text-sm text-muted-foreground hover:text-foreground">← Back</button>
        </div>
      )}

      {/* Step 3: Data Mapping */}
      {step === 'mapping' && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Select Data to Import</h1>
          <p className="text-muted-foreground mb-6">Choose which data you'd like to bring into Ledgable.</p>

          <div className="space-y-3">
            {dataTypes.map(dt => (
              <div key={dt.id} onClick={() => toggleData(dt.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  dt.selected ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border hover:border-border/80'
                }`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  dt.selected ? 'border-emerald-500 bg-emerald-500' : 'border-border'
                }`}>
                  {dt.selected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-xl">{dt.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{dt.label}</div>
                  <div className="text-xs text-muted-foreground">{dt.count > 0 ? `${dt.count} records found` : 'Will scan on import'}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('connect')} className="px-4 py-2 rounded-lg border border-border text-sm">← Back</button>
            <button onClick={() => setStep('review')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 'review' && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Review & Confirm</h1>
          <p className="text-muted-foreground mb-6">Double-check your import settings before we begin.</p>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium">{PLATFORMS.find(p => p.id === platform)?.name}</span>
            </div>
            <div className="border-t border-border" />
            <div className="text-sm text-muted-foreground mb-2">Data to import:</div>
            {dataTypes.filter(d => d.selected).map(d => (
              <div key={d.id} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-400">✓</span> <span>{d.icon}</span> <span>{d.label}</span>
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>⚠️</span>
                <span>Import will not delete any existing Ledgable data. Duplicates are automatically detected and skipped.</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('mapping')} className="px-4 py-2 rounded-lg border border-border text-sm">← Back</button>
            <button onClick={startImport} className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
              Start Import
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Importing */}
      {step === 'importing' && (
        <div className="text-center py-12">
          <div className="text-5xl mb-6 animate-pulse">⚡</div>
          <h1 className="text-2xl font-bold mb-2">Importing Your Data</h1>
          <p className="text-muted-foreground mb-8">This usually takes 1-3 minutes. Don't close this page.</p>
          
          <div className="max-w-md mx-auto">
            <div className="h-3 rounded-full bg-accent overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% complete</div>
          </div>
        </div>
      )}

      {/* Step 6: Done */}
      {step === 'done' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Import Complete!</h1>
          <p className="text-muted-foreground mb-2">Your data has been successfully imported into Ledgable.</p>
          <p className="text-sm text-muted-foreground mb-8">
            {dataTypes.filter(d => d.selected).length} data types imported from {PLATFORMS.find(p => p.id === platform)?.name}
          </p>

          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
              Go to Dashboard
            </a>
            <a href="/transactions" className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-accent">
              View Transactions
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
