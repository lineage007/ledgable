"use client"

import { useState } from "react"
import Image from "next/image"

type BankConnection = {
  id: string; institution: string; accountName: string; bsb: string; number: string;
  balance: number; lastSync: string; status: 'connected' | 'pending' | 'error';
}

const AU_BANKS = [
  { name: 'Commonwealth Bank', logo: '/banks/commbank.png', color: 'bg-yellow-500' },
  { name: 'ANZ', logo: '/banks/anz.png', color: 'bg-blue-600' },
  { name: 'Westpac', logo: '/banks/westpac.png', color: 'bg-red-600' },
  { name: 'NAB', logo: '/banks/nab.png', color: 'bg-gray-800' },
  { name: 'Macquarie', logo: '/banks/macquarie.png', color: 'bg-slate-700' },
  { name: 'Bendigo Bank', logo: '/banks/bendigo.png', color: 'bg-red-700' },
  { name: 'ING', logo: '/banks/ing.png', color: 'bg-orange-500' },
  { name: 'St.George', logo: '/banks/stgeorge.png', color: 'bg-emerald-600' },
  { name: 'Suncorp', logo: '/banks/suncorp.png', color: 'bg-yellow-500' },
  { name: 'Bank of Queensland', logo: '/banks/boq.png', color: 'bg-purple-600' },
  { name: 'Up Bank', logo: '/banks/up.png', color: 'bg-orange-500' },
  { name: 'Other', logo: '', color: 'bg-gray-500' },
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
                  className={`flex items-center gap-3 text-left p-3 rounded-xl border transition-all ${
                    selectedBank === bank.name ? 'border-emerald-500 bg-emerald-500/10' : 'border-border hover:border-emerald-500/30'
                  }`}>
                  {bank.logo ? (
                    <Image src={bank.logo} alt={bank.name} width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">?</div>
                  )}
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
