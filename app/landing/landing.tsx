"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Brand palette
const TEAL = "#0D9488"
const TEAL_DARK = "#134E4A"
const TEAL_700 = "#0F766E"
const AMBER = "#F59E0B"

// ─── SVG Icon Components (replacing emoji) ───
function IconBank() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
}
function IconReceipt() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
}
function IconChart() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
}
function IconCamera() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
}
function IconInvoice() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}
function IconBrain() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
}
function IconShield() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
}
function IconCheck() {
  return <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
}

// ─── Feature Card (SVG icon, outcome-first copy) ───
function FeatureBlock({ icon, title, desc, mockup }: { icon: React.ReactNode; title: string; desc: string; mockup: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-300 group">
      {/* Mockup area */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 h-48 flex items-center justify-center border-b border-slate-100">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</div>
          <div className="text-slate-500 leading-relaxed whitespace-pre-line">{mockup}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-4 group-hover:bg-teal-100 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ─── Pricing Card ───
function PricingCard({
  name, price, annualPrice, desc, features, popular, cta, highlight,
}: {
  name: string; price: string; annualPrice: string; desc: string; features: { text: string; unique?: boolean }[]; popular?: boolean; cta: string; highlight?: string
}) {
  return (
    <div className={`rounded-2xl relative ${popular ? "bg-teal-900 text-white shadow-xl shadow-teal-900/20 ring-2 ring-teal-500" : "bg-white border border-slate-200 shadow-sm"}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
      )}
      <div className="p-8">
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-1 ${popular ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{name}</h3>
          <p className={`text-sm ${popular ? "text-teal-200" : "text-slate-500"}`}>{desc}</p>
        </div>
        <div className="mb-6">
          <span className={`text-5xl font-extrabold ${popular ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>${price}</span>
          <span className={`text-sm ${popular ? "text-teal-300" : "text-slate-500"}`}>/month</span>
          {highlight && <div className={`text-xs mt-1 ${popular ? "text-amber-400" : "text-teal-600"} font-semibold`}>{highlight}</div>}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((f) => (
            <li key={f.text} className="flex items-start gap-3 text-sm">
              <svg className={`w-5 h-5 flex-shrink-0 ${popular ? "text-amber-400" : "text-teal-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              <span className={popular ? "text-teal-100" : "text-slate-600"}>
                {f.text}
                {f.unique && <span className="ml-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">ONLY ON LEDGABLE</span>}
              </span>
            </li>
          ))}
        </ul>
        <Link href="/enter" className={`block w-full text-center py-3.5 rounded-lg font-semibold transition-all duration-200 ${popular ? "bg-amber-500 text-amber-950 hover:bg-amber-400" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
          {cta}
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false)
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [activePersona, setActivePersona] = useState<string | null>(null)

  const personas = [
    { id: "sole", label: "Sole Traders", desc: "Track income, claim deductions, lodge BAS — without a bookkeeper." },
    { id: "freelance", label: "Freelancers", desc: "Invoice clients, scan receipts on the go, know exactly what you owe." },
    { id: "agency", label: "Agencies", desc: "Multi-user access, cashflow forecasting, and team expense tracking." },
    { id: "trades", label: "Tradies", desc: "Quote jobs, track materials, snap receipts from site — BAS does itself." },
    { id: "ecom", label: "E-commerce", desc: "Sync sales channels, auto-match payments, GST on every transaction." },
    { id: "startup", label: "Startups", desc: "Burn rate tracking, Money Rules for runway, investor-ready reports." },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ── NAV ── */}
      <header className="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo/wordmark.png" alt="Ledgable" width={140} height={36} className="h-9 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
            <a href="#australia" className="hover:text-teal-600 transition-colors">For Australia</a>
            <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
            <Link href="/enter" className="text-slate-900 hover:text-teal-600 transition-colors">Log in</Link>
            <Link href="/enter" className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold">Try Ledgable free</Link>
          </nav>
          <button className="md:hidden p-2" onClick={() => setMobileNav(!mobileNav)}>
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#pricing" className="block text-slate-600 font-medium">Pricing</a>
            <a href="#australia" className="block text-slate-600 font-medium">For Australia</a>
            <a href="#faq" className="block text-slate-600 font-medium">FAQ</a>
            <Link href="/enter" className="block bg-teal-600 text-white text-center py-3 rounded-lg font-semibold">Try Ledgable free</Link>
          </div>
        )}
      </header>

      {/* ── HERO (Section 1: specific headline, product visual, micro-trust) ── */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Built from scratch for Australian businesses
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                AI does your books.
                <br />
                <span style={{ color: TEAL }}>You run your business.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
                Bank feeds, GST, BAS lodgment, and receipt scanning — all automated. 
                The $9/month Xero alternative that Australian businesses are switching to.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/enter" className="bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:-translate-y-0.5 text-center">
                  See what $9/month accounting looks like
                </Link>
              </div>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><IconShield /> Bank-grade encryption</span>
                <span className="flex items-center gap-1.5"><IconShield /> Australian hosted</span>
                <span>No credit card required</span>
              </div>
            </div>

            {/* Right — Product mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl shadow-slate-900/30 p-1 ring-1 ring-white/10">
                <div className="bg-slate-900 rounded-xl overflow-hidden">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/80" /><div className="w-3 h-3 rounded-full bg-amber-400/80" /><div className="w-3 h-3 rounded-full bg-green-400/80" /></div>
                    <div className="flex-1 text-center"><span className="text-[11px] text-slate-500 bg-slate-800 px-3 py-0.5 rounded">ledgable.co/dashboard</span></div>
                  </div>
                  {/* Dashboard mockup */}
                  <div className="p-5 space-y-4">
                    {/* KPI row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { l: "Revenue", v: "$24,850", c: "text-teal-400", b: "border-l-teal-400" },
                        { l: "Expenses", v: "$18,320", c: "text-slate-300", b: "border-l-rose-400" },
                        { l: "Net Profit", v: "$6,530", c: "text-emerald-400", b: "border-l-emerald-400" },
                      ].map(k => (
                        <div key={k.l} className={`bg-slate-800/60 rounded-lg p-3 border-l-2 ${k.b}`}>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">{k.l}</div>
                          <div className={`text-lg font-bold font-mono ${k.c}`}>{k.v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Money Rules mini */}
                    <div className="bg-slate-800/60 rounded-lg p-3">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Money Rules™</div>
                      {[
                        { n: "Operating", p: 95, c: "bg-teal-500" },
                        { n: "Tax Reserve", p: 88, c: "bg-amber-500" },
                        { n: "Owner Pay", p: 105, c: "bg-red-500" },
                      ].map(r => (
                        <div key={r.n} className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] text-slate-400 w-16 shrink-0">{r.n}</span>
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${r.c}`} style={{ width: `${Math.min(r.p, 100)}%` }} /></div>
                          <span className="text-[10px] text-slate-400 w-8 text-right">{r.p}%</span>
                        </div>
                      ))}
                    </div>
                    {/* Transactions */}
                    <div className="bg-slate-800/60 rounded-lg p-3">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Recent Transactions</div>
                      {[
                        { d: "Mar 19", n: "Bunnings Warehouse", a: "-$284.50", cat: "Materials" },
                        { d: "Mar 18", n: "Invoice #1042 — Smith Plumbing", a: "+$3,200.00", cat: "Revenue" },
                        { d: "Mar 17", n: "Shell Coles Express", a: "-$95.20", cat: "Fuel" },
                      ].map(t => (
                        <div key={t.n} className="flex items-center justify-between py-1.5 border-b border-slate-700/30 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-500 font-mono w-10">{t.d}</span>
                            <span className="text-xs text-slate-300">{t.n}</span>
                          </div>
                          <span className={`text-xs font-mono font-medium ${t.a.startsWith("+") ? "text-emerald-400" : "text-slate-400"}`}>{t.a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* AI insight floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-200 p-4 max-w-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><IconBrain /></div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Ledge AI</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">&ldquo;Set aside $3,200 for GST this quarter. Your BAS is auto-prepared and ready to lodge.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Persona tags — interactive */}
          <div className="mt-16 pt-12 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center mb-4">Built for every Australian business type</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {personas.map(p => (
                <button key={p.id} onClick={() => setActivePersona(activePersona === p.id ? null : p.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activePersona === p.id ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            {activePersona && (
              <div className="text-center text-sm text-slate-600 animate-in fade-in duration-200">
                {personas.find(p => p.id === activePersona)?.desc}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MONEY RULES (Section 2: elevated as #1 differentiator) ── */}
      <section className="py-20 md:py-28 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-amber-200">
                ★ Only on Ledgable — no competitor has this
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Money Rules™
              </h2>
              <p className="text-slate-500 text-sm mb-6">Based on the Profit First method — every dollar that arrives gets a job.</p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Set percentage-based rules for every dollar that comes in. Ledgable tracks whether you&apos;re on target in real time — 
                so you always know if the business is healthy, before BAS is due.
              </p>
              {/* Rich animated progress bars */}
              <div className="space-y-3">
                {[
                  { name: "Operating Costs", pct: 40, actual: 38, color: TEAL, emoji: "" },
                  { name: "Tax Reserve", pct: 25, actual: 22, color: AMBER, emoji: "" },
                  { name: "Owner Pay", pct: 20, actual: 21, color: "#6366F1", emoji: "" },
                  { name: "Growth Fund", pct: 15, actual: 19, color: "#EC4899", emoji: "" },
                ].map((r) => (
                  <div key={r.name} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-900">{r.name}</span>
                      <span className={`text-xs font-mono ${r.actual > r.pct ? "text-red-500 font-bold" : "text-slate-500"}`}>
                        {r.actual}% of {r.pct}% target {r.actual > r.pct ? "⚠️ Over" : "✓"}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((r.actual / r.pct) * 100, 100)}%`, background: r.actual > r.pct ? "#EF4444" : r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* AI insight card — styled as real product */}
              <div className="bg-teal-900 rounded-2xl p-8 md:p-10 text-white mb-6">
                <div className="text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">Ledge AI Insight</div>
                <p className="text-xl font-semibold leading-relaxed mb-4">
                  &ldquo;Your Growth Fund is 4% over target this month. Consider redirecting $1,200 to Tax Reserve before your next BAS is due on April 28.&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-teal-800">
                  <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center"><IconBrain /></div>
                  <div>
                    <div className="text-sm font-semibold">Ledge AI</div>
                    <div className="text-xs text-teal-400">Based on your last 90 days of data</div>
                  </div>
                </div>
              </div>
              {/* Micro-scenario */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Real scenario</div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Last quarter, Money Rules flagged that Sarah&apos;s tax reserve was $4,200 short — three weeks before BAS was due. 
                  She moved the money and lodged on time. No penalty. No stress.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES (Section 3: outcome-first, with mockups) ── */}
      <section id="features" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything Xero does.<br /><span style={{ color: TEAL }}>Without the price tag.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">No hidden add-ons. No per-employee fees. AI that auto-categorises 95% of transactions correctly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureBlock icon={<IconBank />} title="Bank feeds, sorted"
              desc="Every transaction, categorised before you see it. Connects to all Australian banks via Open Banking — reconciliation takes seconds, not hours."
              mockup={"CBA ···4521  → Synced\nWestpac ···8834  → Synced\n\n✓ 142 transactions auto-matched\n✓ 3 need review"} />
            <FeatureBlock icon={<IconReceipt />} title="BAS done in seconds"
              desc="Every transaction auto-classified for GST. Your BAS populates itself — lodge directly to the ATO without an accountant middleman."
              mockup={"Q3 BAS Summary\nGST collected    $4,218\nGST paid         $2,891\nOwing            $1,327\n\n→ Ready to lodge via SBR"} />
            <FeatureBlock icon={<IconChart />} title="Know your cashflow"
              desc="See where every dollar goes. Get alerts like 'set aside $3,200 for GST this quarter' — always know where you stand before it's too late."
              mockup={"Forecast (30 days)\nIn   $18,400  ▲ 12%\nOut  $14,200  ▼ 3%\nNet  +$4,200\n\n⚠ Rent due in 8 days"} />
            <FeatureBlock icon={<IconCamera />} title="Snap receipts, done"
              desc="Photo any receipt in any language — AI extracts merchant, amount, date, and GST in 2 seconds. No manual data entry, ever."
              mockup={"📷 Receipt detected\nBunnings Warehouse\n$284.50 inc GST\nMar 19, 2026\n→ Auto-filed: Materials"} />
            <FeatureBlock icon={<IconInvoice />} title="Invoicing that gets paid"
              desc="Create professional tax invoices in seconds. Send via email. Auto-match when payment lands in your bank feed."
              mockup={"INV-1042 → Smith Plumbing\n$3,200.00 inc GST\nSent Mar 15 · Due Apr 14\n\n✓ Payment received Mar 18"} />
            <FeatureBlock icon={<IconBrain />} title="Your AI tax advisor"
              desc="'Prepay $2,100 in super before June 30 to save $630 on tax.' Always working in the background so you never miss a deduction."
              mockup={"💡 Insight\nPrepay $2,100 in super\nbefore June 30\n→ Saves $630 on tax\n→ 1 click to schedule"} />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF (Section 4: trust signals) ── */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Switched from Xero and saving $780/year. BAS took me 4 minutes last quarter.", name: "Jake M.", role: "Electrician, Sydney" },
              { quote: "The receipt scanner is magic. I just snap a photo on site and it's filed. My bookkeeper is jealous.", name: "Priya K.", role: "Interior Designer, Melbourne" },
              { quote: "Money Rules changed how I think about my business. I finally know if I'm profitable in real time.", name: "Tom R.", role: "E-commerce, Brisbane" },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex mb-3">{[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-sm"><span className="font-semibold text-slate-900">{t.name}</span> <span className="text-slate-400">· {t.role}</span></div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><IconShield /> 256-bit AES encryption</span>
            <span className="flex items-center gap-1.5"><IconShield /> CDR accredited</span>
            <span className="flex items-center gap-1.5"><IconShield /> Australian-hosted data</span>
            <span className="flex items-center gap-1.5"><IconShield /> SOC 2 compliant infrastructure</span>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR AUSTRALIA (Section 5: scenario-based) ── */}
      <section id="australia" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Not a US app with an Australian skin.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">Every feature built from the ground up for Australian tax law, banks, and business.</p>
          
          {/* Scenario blocks */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { headline: "BAS quarter?", sub: "Already done.", desc: "GST auto-classified on every transaction. Your BAS populates itself. Lodge to ATO in one click." },
              { headline: "EOFY panic?", sub: "Not anymore.", desc: "Deductions tracked all year. Super pre-payment reminders. Tax estimate updated in real time." },
              { headline: "Super deadline?", sub: "We reminded you last week.", desc: "Automatic alerts for SG payments, PAYG instalments, and every ATO due date." },
            ].map(s => (
              <div key={s.headline} className="bg-white rounded-xl p-6 border border-slate-200 text-left hover:border-teal-300 transition-colors">
                <h3 className="text-xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.headline} <span style={{ color: TEAL }}>{s.sub}</span>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Technical details — collapsible */}
          <details className="max-w-2xl mx-auto text-left">
            <summary className="cursor-pointer text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              For accountants: full regulatory compliance details →
            </summary>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["GST auto-classification", "BAS auto-preparation", "ATO lodgment via SBR", "Single Touch Payroll", "CDR Open Banking", "July–June financial year", "Tax invoice format", "PAYG withholding", "Superannuation tracking"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-600"><IconCheck />{item}</div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ── PRICING (Section 6: savings calculator, annual toggle) ── */}
      <section id="pricing" className="py-20 md:py-28 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Simple pricing. No surprises.
            </h2>
            <p className="text-lg text-slate-600 mb-6">Every plan includes GST, bank feeds, and BAS. No add-on fees.</p>
            
            {/* Savings callout */}
            <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3 mb-8">
              <span className="text-amber-600 font-bold text-sm">💰 Save vs Xero:</span>
              <span className="text-slate-700 text-sm">A typical small business pays Xero <strong>$75/mo</strong> for Grow + Hubdoc. Ledgable Business: <strong>$19/mo</strong>.</span>
              <span className="text-amber-700 font-extrabold text-lg">Save $672/yr</span>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!billingAnnual ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
              <button onClick={() => setBillingAnnual(!billingAnnual)} className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${billingAnnual ? "bg-teal-600" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${billingAnnual ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
              <span className={`text-sm font-medium ${billingAnnual ? "text-slate-900" : "text-slate-400"}`}>Annual <span className="text-teal-600 font-bold">save 17%</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-4 items-start">
            <PricingCard name="Solo" price={billingAnnual ? "7.50" : "9"} annualPrice="90" desc="Freelancers & sole traders" cta="Try Ledgable free — no card needed"
              highlight={billingAnnual ? "Billed $90/year" : undefined}
              features={[
                { text: "1 user" },
                { text: "Bank feeds — all AU banks" },
                { text: "AI receipt scanning" },
                { text: "GST tracking & BAS prep" },
                { text: "Unlimited transactions" },
                { text: "Email support" },
              ]} />
            <PricingCard name="Business" price={billingAnnual ? "16" : "19"} annualPrice="192" desc="Small businesses & growing teams" cta="Try Ledgable free — no card needed" popular
              highlight={billingAnnual ? "Billed $192/year — save $36" : undefined}
              features={[
                { text: "Up to 5 users" },
                { text: "Everything in Solo" },
                { text: "Invoicing & quotes" },
                { text: "Money Rules™ budgeting", unique: true },
                { text: "Cashflow forecasting" },
                { text: "AI tax advisor", unique: true },
                { text: "ATO BAS lodgment" },
                { text: "Priority support" },
              ]} />
            <PricingCard name="Pro" price={billingAnnual ? "24" : "29"} annualPrice="288" desc="Established businesses" cta="Try Ledgable free — no card needed"
              highlight={billingAnnual ? "Billed $288/year — save $60" : undefined}
              features={[
                { text: "Unlimited users" },
                { text: "Everything in Business" },
                { text: "Single Touch Payroll" },
                { text: "Multi-entity" },
                { text: "Accountant portal" },
                { text: "API access" },
                { text: "Dedicated support" },
              ]} />
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">Prices in AUD, inc. GST. 14-day free trial on all plans. Cancel anytime.</p>
        </div>
      </section>

      {/* ── COMPARISON (Section 7: multi-competitor, price row emphasised) ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How Ledgable compares</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-5 bg-slate-50 text-xs font-bold text-slate-500 p-4 border-b border-slate-200 uppercase tracking-wider">
              <div>Feature</div>
              <div className="text-center" style={{ color: TEAL }}>Ledgable</div>
              <div className="text-center">Xero</div>
              <div className="text-center">MYOB</div>
              <div className="text-center">QuickBooks</div>
            </div>
            {[
              { feat: "Starting price", us: "$9/mo", xero: "$35/mo", myob: "$13/mo", qb: "$15/mo", highlight: true },
              { feat: "Bank feeds", us: "✅ All plans", xero: "✅", myob: "✅", qb: "✅" },
              { feat: "GST auto-classify", us: "✅ AI-powered", xero: "❌ Manual", myob: "⚠️ Basic rules", qb: "⚠️ Basic rules" },
              { feat: "BAS lodgment", us: "✅ Built-in SBR", xero: "✅ Via accountant", myob: "✅", qb: "❌" },
              { feat: "Receipt scanning", us: "✅ AI — any language", xero: "⚠️ Hubdoc add-on", myob: "✅", qb: "✅" },
              { feat: "Cashflow forecast", us: "✅ All plans", xero: "⚠️ Premium only", myob: "❌", qb: "⚠️ Plus only" },
              { feat: "Money Rules™", us: "✅ Unique", xero: "❌", myob: "❌", qb: "❌" },
              { feat: "AI tax advisor", us: "✅ Built-in", xero: "⚠️ JAX (new)", myob: "❌", qb: "❌" },
              { feat: "App integrations", us: "Growing", xero: "1,000+", myob: "200+", qb: "750+" },
            ].map(row => (
              <div key={row.feat} className={`grid grid-cols-5 p-4 border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors ${row.highlight ? "bg-teal-50/50" : ""}`}>
                <div className={`text-slate-700 ${row.highlight ? "font-bold" : "font-medium"}`}>{row.feat}</div>
                <div className={`text-center ${row.highlight ? "font-extrabold text-teal-700 text-lg" : "text-slate-900"}`}>{row.us}</div>
                <div className={`text-center ${row.highlight ? "text-slate-500 line-through" : "text-slate-500"}`}>{row.xero}</div>
                <div className="text-center text-slate-500">{row.myob}</div>
                <div className="text-center text-slate-500">{row.qb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (Section 8: new) ── */}
      <section id="faq" className="py-20 md:py-28 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is my data secure?", a: "Yes. Ledgable uses 256-bit AES encryption, the same standard used by Australian banks. Your data is hosted on Australian servers and never shared with third parties." },
              { q: "Can my accountant access it?", a: "Absolutely. The Pro plan includes an Accountant Portal with read-only access. Your accountant can review transactions, download reports, and lodge BAS — all from their own login." },
              { q: "How do I switch from Xero?", a: "We offer free migration assistance. Export your Xero data as CSV and import it into Ledgable in minutes. Our AI maps your chart of accounts automatically." },
              { q: "What if I need help with BAS?", a: "Ledgable auto-prepares your BAS from classified transactions. If you need human support, our team includes registered BAS agents who can review your return before lodgment." },
              { q: "Do I still need a bookkeeper?", a: "For most sole traders and small businesses, no. Ledgable automates categorisation, GST, and BAS prep. You may still want an accountant for year-end tax planning, but the day-to-day bookkeeping is handled." },
              { q: "Is there a free trial?", a: "Yes — 14 days free on all plans, no credit card required. You can connect your bank, scan receipts, and run your first BAS before paying a cent." },
            ].map(faq => (
              <details key={faq.q} className="bg-white rounded-xl border border-slate-200 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 text-sm hover:text-teal-700 transition-colors">
                  {faq.q}
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (Section 9: with guarantee) ── */}
      <section className="py-20 md:py-28 px-4" style={{ background: TEAL_DARK }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Stop overpaying for accounting.
          </h2>
          <p className="text-lg text-teal-200 mb-8 max-w-xl mx-auto">
            Switch from Xero in under 10 minutes. Free migration. Free trial. No risk.
          </p>
          <Link href="/enter" className="inline-block px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg" style={{ background: AMBER, color: "#78350F" }}>
            See what $9/month accounting looks like →
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-teal-300">
            <span>✓ 14-day free trial</span>
            <span>✓ No credit card</span>
            <span>✓ Free Xero migration</span>
            <span>✓ Cancel anytime</span>
          </div>
          <p className="text-xs text-teal-500 mt-6">30-day money-back guarantee. If Ledgable doesn&apos;t work for your business, we&apos;ll refund you — no questions.</p>
        </div>
      </section>

      {/* ── FOOTER (Section 10: clean, with security badges, no "ABN coming soon") ── */}
      <footer className="py-12 px-4 bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logo/wordmark.png" alt="Ledgable" width={120} height={32} className="h-8 w-auto brightness-0 invert opacity-80" />
              </div>
              <p className="text-sm text-slate-500 max-w-xs mb-4">AI-powered accounting built for Australian businesses. Simple. Smart. Affordable.</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><IconShield /> 256-bit encryption</span>
                <span className="flex items-center gap-1"><IconShield /> AU-hosted</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Product</div>
                <div className="space-y-2">
                  <a href="#features" className="block hover:text-white transition-colors">Features</a>
                  <a href="#pricing" className="block hover:text-white transition-colors">Pricing</a>
                  <a href="#faq" className="block hover:text-white transition-colors">FAQ</a>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2">
                  <a href="mailto:hello@ledgable.co" className="block hover:text-white transition-colors">Contact</a>
                  <Link href="/enter" className="block hover:text-white transition-colors">Log in</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Legal</div>
                <div className="space-y-2">
                  <Link href="/docs/privacy_policy" className="block hover:text-white transition-colors">Privacy</Link>
                  <Link href="/docs/terms" className="block hover:text-white transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} Ledgable Pty Ltd. Part of the Lineage HQ portfolio.</span>
            <span>Made in 🇦🇺 Australia</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
