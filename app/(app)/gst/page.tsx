import { FileText, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

const QUARTERS = ["Q3 FY26 (Jan–Mar)", "Q2 FY26 (Oct–Dec)", "Q1 FY26 (Jul–Sep)", "Q4 FY25 (Apr–Jun)"]

const TRANSACTIONS = [
  { date: "Mar 18", desc: "Office Supplies — Officeworks", amount: 247.50, gstRate: "10%", gst: 22.50, cat: "Office", type: "expense" },
  { date: "Mar 17", desc: "Client Payment — Acme Corp", amount: 5500.00, gstRate: "10%", gst: 500.00, cat: "Revenue", type: "income" },
  { date: "Mar 16", desc: "Telstra Mobile Plan", amount: 89.00, gstRate: "10%", gst: 8.09, cat: "Telecom", type: "expense" },
  { date: "Mar 15", desc: "Bank Interest", amount: 42.30, gstRate: "GST-Free", gst: 0, cat: "Finance", type: "income" },
  { date: "Mar 14", desc: "Insurance — CGU", amount: 1200.00, gstRate: "N/A", gst: 0, cat: "Insurance", type: "expense" },
  { date: "Mar 13", desc: "Adobe Creative Cloud", amount: 79.99, gstRate: "10%", gst: 7.27, cat: "Software", type: "expense" },
  { date: "Mar 12", desc: "Client Payment — Beta Ltd", amount: 3300.00, gstRate: "10%", gst: 300.00, cat: "Revenue", type: "income" },
]

export default function GSTPage() {
  const collected = 4280.00
  const credits = 1842.50
  const netOwing = collected - credits

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            GST & BAS
          </h1>
          <p className="text-slate-500 text-sm mt-1">Quarter: January – March 2026</p>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white">
          {QUARTERS.map(q => <option key={q}>{q}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <TrendingUp className="w-4 h-4 text-teal-600" /> GST Collected
          </div>
          <div className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans'" }}>
            ${collected.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">On sales this quarter</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" /> Input Tax Credits
          </div>
          <div className="text-3xl font-extrabold text-emerald-600" style={{ fontFamily: "'Plus Jakarta Sans'" }}>
            -${credits.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">GST paid on purchases</div>
        </div>
        <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-sm text-amber-700 mb-2">
            <AlertCircle className="w-4 h-4" /> Net GST Owing
          </div>
          <div className="text-3xl font-extrabold text-amber-700" style={{ fontFamily: "'Plus Jakarta Sans'" }}>
            ${netOwing.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-amber-600 mt-1">BAS due April 28, 2026</div>
        </div>
      </div>

      {/* BAS CTA */}
      <div className="bg-teal-900 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-white">
          <div className="font-bold text-lg">Your Q3 BAS is ready to prepare</div>
          <div className="text-teal-300 text-sm mt-1">All transactions classified. Net GST: ${netOwing.toFixed(2)}. Due in 41 days.</div>
        </div>
        <a href="/bas" className="bg-amber-500 text-amber-950 px-6 py-3 rounded-lg font-bold hover:bg-amber-400 transition-colors whitespace-nowrap">
          Prepare BAS →
        </a>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">GST Transactions</h3>
          <button className="text-xs text-teal-600 font-semibold hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium text-center">GST Rate</th>
                <th className="px-6 py-3 font-medium text-right">GST</th>
                <th className="px-6 py-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-500">{t.date}</td>
                  <td className="px-6 py-3 text-slate-900 font-medium">{t.desc}</td>
                  <td className={`px-6 py-3 text-right font-semibold ${t.type === "income" ? "text-teal-600" : "text-slate-900"}`}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      t.gstRate === "10%" ? "bg-teal-50 text-teal-700" :
                      t.gstRate === "GST-Free" ? "bg-slate-100 text-slate-600" :
                      "bg-slate-50 text-slate-400"
                    }`}>
                      {t.gstRate}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-600">${t.gst.toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{t.cat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
