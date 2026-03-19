"use client"

import { useState, useEffect, useTransition } from "react"
import { getBankConnections, addBankConnection, importBankCSV, getRecentTransactions } from "./actions"
import { Building2, Plus, Upload, RefreshCw, ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const AU_BANKS = [
  { name: "Commonwealth Bank", color: "#FFD700", icon: "🟡" },
  { name: "Westpac", color: "#DA251D", icon: "🔴" },
  { name: "ANZ", color: "#007DBA", icon: "🔵" },
  { name: "NAB", color: "#C8102E", icon: "🔴" },
  { name: "Macquarie", color: "#000000", icon: "⚫" },
  { name: "ING", color: "#FF6200", icon: "🟠" },
  { name: "Up Bank", color: "#FF7043", icon: "🧡" },
  { name: "Bendigo Bank", color: "#8B2346", icon: "🟤" },
  { name: "Other", color: "#6366f1", icon: "🏦" },
]

export default function BankFeedsPage() {
  const [connections, setConnections] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [importResult, setImportResult] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const conns = await getBankConnections()
    setConnections(conns)
    const txns = await getRecentTransactions()
    setTransactions(txns)
  }

  async function handleAddBank(formData: FormData) {
    startTransition(async () => {
      await addBankConnection(formData)
      setShowAdd(false)
      loadData()
    })
  }

  async function handleCSVImport(connectionId: string) {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      startTransition(async () => {
        const result = await importBankCSV(connectionId, text)
        setImportResult(`Imported ${result.imported} transactions`)
        loadData()
        setTimeout(() => setImportResult(null), 3000)
      })
    }
    input.click()
  }

  const totalBalance = connections.reduce((sum, c) => sum + Number(c.balance || 0), 0)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bank Feeds</h1>
          <p className="text-slate-500 mt-1">Connect your accounts, import transactions</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" /> Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <form action={handleAddBank} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Bank</label>
                <select name="institution" className="w-full mt-1 p-2 border rounded-lg text-slate-900">
                  {AU_BANKS.map(b => (
                    <option key={b.name} value={b.name}>{b.icon} {b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Account Name</label>
                <Input name="accountName" placeholder="e.g. Everyday Account" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">BSB</label>
                  <Input name="accountBSB" placeholder="062-000" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Account Number</label>
                  <Input name="accountNumber" placeholder="1234 5678" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Current Balance (AUD)</label>
                <Input name="balance" type="number" step="0.01" placeholder="0.00" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                {isPending ? "Adding..." : "Add Account"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {importResult && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
          ✅ {importResult}
        </div>
      )}

      {/* Balance Overview */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <Wallet className="w-4 h-4" /> Total Balance
        </div>
        <div className="text-4xl font-extrabold tracking-tight">
          ${totalBalance.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-slate-400 text-sm mt-1">{connections.length} account{connections.length !== 1 ? "s" : ""} connected</div>
      </div>

      {/* Connected Accounts */}
      <div className="grid gap-4 md:grid-cols-2">
        {connections.map((conn) => {
          const bank = AU_BANKS.find(b => b.name === conn.institution) || AU_BANKS[AU_BANKS.length - 1]
          return (
            <div key={conn.id} className="border rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bank.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-900">{conn.accountName}</div>
                    <div className="text-sm text-slate-500">{conn.institution} · {conn.accountBSB || "Manual"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-slate-900">
                    ${Number(conn.balance || 0).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-emerald-600">● Connected</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCSVImport(conn.id)}>
                  <Upload className="w-3 h-3 mr-1" /> Import CSV
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <RefreshCw className="w-3 h-3 mr-1" /> Sync
                </Button>
              </div>
            </div>
          )
        })}

        {connections.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-600">No accounts connected</h3>
            <p className="text-slate-400 text-sm mt-1">Add your bank account and import transactions via CSV</p>
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Your First Account
            </Button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Transactions</h2>
          <div className="bg-white rounded-xl border divide-y">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(txn.amount) >= 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                    {Number(txn.amount) >= 0 ? <ArrowDownRight className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{txn.description}</div>
                    <div className="text-xs text-slate-400">{new Date(txn.date).toLocaleDateString("en-AU")} · {txn.connection?.institution}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${Number(txn.amount) >= 0 ? "text-emerald-600" : "text-slate-900"}`}>
                    {Number(txn.amount) >= 0 ? "+" : ""}${Number(txn.amount).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </div>
                  {txn.gstAmount && <div className="text-xs text-slate-400">GST: ${Number(txn.gstAmount).toFixed(2)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
