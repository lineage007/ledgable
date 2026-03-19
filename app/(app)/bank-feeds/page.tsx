import { Landmark, Plus, RefreshCw, ArrowUpRight, ArrowDownLeft, Link2 } from "lucide-react"

const BANKS = [
  { name: "Commonwealth Bank", short: "CBA", color: "#FFCC00", bg: "#FFF9E0", accounts: [
    { name: "Business Cheque", bsb: "06-2000", number: "••••4821", balance: 24680.50, lastSync: "2 min ago" },
    { name: "Business Savings", bsb: "06-2000", number: "••••9103", balance: 8420.00, lastSync: "2 min ago" },
  ]},
  { name: "ANZ", short: "ANZ", color: "#007DBA", bg: "#E0F2FE", accounts: [
    { name: "Business Account", bsb: "01-3050", number: "••••7755", balance: 12340.25, lastSync: "5 min ago" },
  ]},
  { name: "Westpac", short: "WBC", color: "#D5002B", bg: "#FEE2E2", accounts: [
    { name: "Business One", bsb: "03-2000", number: "••••3392", balance: 5890.80, lastSync: "12 min ago" },
  ]},
]

export default function BankFeedsPage() {
  const totalBalance = BANKS.flatMap(b => b.accounts).reduce((s, a) => s + a.balance, 0)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bank Feeds
          </h1>
          <p className="text-slate-500 text-sm mt-1">Connected via Open Banking (CDR)</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm">
          <Plus className="w-4 h-4" /> Connect bank
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 rounded-2xl p-6 text-white">
        <div className="text-teal-300 text-sm font-medium mb-1">Total Cash Position</div>
        <div className="text-4xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ${totalBalance.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-teal-400 text-sm mt-2">Across {BANKS.flatMap(b => b.accounts).length} accounts · {BANKS.length} banks</div>
      </div>

      {/* Banks */}
      {BANKS.map(bank => (
        <div key={bank.short} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: bank.bg, color: bank.color }}>
                {bank.short}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{bank.name}</div>
                <div className="text-xs text-slate-400">{bank.accounts.length} account{bank.accounts.length > 1 ? "s" : ""} connected</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Sync now
            </button>
          </div>
          {bank.accounts.map(acc => (
            <div key={acc.number} className="px-6 py-4 border-b border-slate-50 last:border-0 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm font-medium text-slate-900">{acc.name}</div>
                  <div className="text-xs text-slate-400">BSB {acc.bsb} · {acc.number}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">
                  ${acc.balance.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-400">Synced {acc.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Connect More */}
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors cursor-pointer group">
        <Link2 className="w-8 h-8 text-slate-300 mx-auto mb-3 group-hover:text-teal-500 transition-colors" />
        <div className="text-sm font-semibold text-slate-500 group-hover:text-teal-700">Connect another bank</div>
        <div className="text-xs text-slate-400 mt-1">Supports all Australian banks via CDR Open Banking</div>
      </div>
    </div>
  )
}
