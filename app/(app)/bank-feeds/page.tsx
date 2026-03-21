"use client"

import { useState } from "react"

type BankConnection = {
  id: string; institution: string; accountName: string; bsb: string; number: string;
  balance: number; lastSync: string; status: 'connected' | 'pending' | 'error';
}

const AU_BANKS = [
  { name: 'Commonwealth Bank', icon: '🟡', color: 'amber' },
  { name: 'ANZ', icon: '🔵', color: 'blue' },
  { name: 'Westpac', icon: '🔴', color: 'red' },
  { name: 'NAB', icon: '⚫', color: 'gray' },
  { name: 'Macquarie', icon: '⬛', color: 'slate' },
  { name: 'Bendigo Bank', icon: '🟤', color: 'orange' },
  { name: 'ING', icon: '🟠', color: 'orange' },
  { name: 'St.George', icon: '🐉', color: 'emerald' },
  { name: 'Suncorp', icon: '☀️', color: 'yellow' },
  { name: 'Bank of Queensland', icon: '🏦', color: 'purple' },
  { name: 'Up Bank', icon: '🍊', color: 'orange' },
  { name: 'Other', icon: '🏛️', color: 'gray' },
]

export default function BankFeedsPage() {
  const [connections] = useState<BankConnection[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bank Feeds</h1>
          <p className="text-sm text-muted-foreground">Connect your Australian bank accounts for automatic transaction sync</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
          + Connect Bank
        </button>
      </div>

      {/* Connected Accounts */}
      {connections.length > 0 ? (
        <div className="space-y-4 mb-8">
          {connections.map(conn => (
            <div key={conn.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">🏦</div>
                <div>
                  <div className="font-semibold">{conn.institution}</div>
                  <div className="text-sm text-muted-foreground">{conn.accountName} · BSB {conn.bsb} · ****{conn.number.slice(-4)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg">${conn.balance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-muted-foreground">Last synced: {conn.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center mb-8">
          <div className="text-5xl mb-4">🏦</div>
          <h3 className="text-lg font-semibold mb-2">No bank accounts connected</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Connect your bank to automatically import transactions and keep your books up to date. 
            Supports 250+ Australian banks via Basiq.
          </p>
          <button onClick={() => setShowAdd(true)} className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
            Connect Your First Bank
          </button>
        </div>
      )}

      {/* Manual Import */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-3">Manual Import</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload bank statements in CSV, OFX, or QIF format if you prefer not to connect directly.
        </p>
        <div className="rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
          <div className="text-3xl mb-2">📁</div>
          <p className="text-sm text-muted-foreground">Drag and drop files or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">Supports CSV, OFX, QIF</p>
        </div>
      </div>

      {/* Bank Selection Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setShowAdd(false); setSelectedBank(null) }}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Connect Bank Account</h3>
            <p className="text-sm text-muted-foreground mb-4">Select your bank to begin secure connection via Basiq</p>
            
            <div className="grid grid-cols-2 gap-3">
              {AU_BANKS.map(bank => (
                <button key={bank.name} onClick={() => setSelectedBank(bank.name)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedBank === bank.name ? 'border-emerald-500 bg-emerald-500/10' : 'border-border hover:border-emerald-500/30'
                  }`}>
                  <span className="text-xl mr-2">{bank.icon}</span>
                  <span className="text-sm font-medium">{bank.name}</span>
                </button>
              ))}
            </div>

            {selectedBank && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  🔒 You'll be redirected to {selectedBank}'s secure login. Ledgable uses read-only access and never stores your banking credentials.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowAdd(false); setSelectedBank(null) }} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
                    Connect {selectedBank}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
