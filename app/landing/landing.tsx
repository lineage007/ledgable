"use client"

import Link from "next/link"
import { useState } from "react"

const TEAL = "#0D9488"
const TEAL_DARK = "#134E4A"
const TEAL_700 = "#0F766E"
const AMBER = "#F59E0B"
const AMBER_DARK = "#D97706"

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-200 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-5 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  )
}

function PricingCard({
  name, price, desc, features, popular, cta,
}: {
  name: string; price: string; desc: string; features: string[]; popular?: boolean; cta: string
}) {
  return (
    <div
      className={`rounded-2xl p-8 relative ${
        popular
          ? "bg-teal-900 text-white shadow-xl shadow-teal-900/20 scale-[1.02]"
          : "bg-white border border-slate-200 shadow-sm"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className="mb-6">
        <h3
          className={`text-lg font-bold mb-1 ${popular ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {name}
        </h3>
        <p className={`text-sm ${popular ? "text-teal-200" : "text-slate-500"}`}>{desc}</p>
      </div>
      <div className="mb-6">
        <span
          className={`text-5xl font-extrabold ${popular ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          ${price}
        </span>
        <span className={`text-sm ${popular ? "text-teal-300" : "text-slate-500"}`}>/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <svg className={`w-5 h-5 flex-shrink-0 ${popular ? "text-amber-400" : "text-teal-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className={popular ? "text-teal-100" : "text-slate-600"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/enter"
        className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
          popular
            ? "bg-amber-500 text-amber-950 hover:bg-amber-400"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ── NAV ── */}
      <header className="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm" style={{ background: TEAL }}>
              L
            </div>
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ledgable
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-teal-600 transition-colors">Pricing</a>
            <a href="#australia" className="hover:text-teal-600 transition-colors">For Australia</a>
            <Link href="/enter" className="text-slate-900 hover:text-teal-600 transition-colors">Log in</Link>
            <Link
              href="/enter"
              className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Start free trial
            </Link>
          </nav>
          <button className="md:hidden p-2" onClick={() => setMobileNav(!mobileNav)}>
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#pricing" className="block text-slate-600 font-medium">Pricing</a>
            <a href="#australia" className="block text-slate-600 font-medium">For Australia</a>
            <Link href="/enter" className="block bg-teal-600 text-white text-center py-3 rounded-lg font-semibold">Start free trial</Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Built for Australian businesses
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Accounting that
            <br />
            <span style={{ color: TEAL }}>actually makes sense</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered bookkeeping with bank feeds, automatic GST, and BAS lodgment built in.
            The Xero alternative that costs a third of the price.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/enter"
              className="bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5"
            >
              Start your free trial →
            </Link>
            <a
              href="#features"
              className="text-slate-600 px-8 py-4 rounded-xl text-lg font-medium border border-slate-200 hover:border-teal-300 hover:text-teal-700 transition-all duration-200"
            >
              See how it works
            </a>
          </div>
          <p className="text-sm text-slate-400">No credit card required · Free for 14 days · Cancel anytime</p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">Trusted by forward-thinking Australian businesses</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 items-center opacity-40">
            {["Sole Traders", "Freelancers", "Agencies", "Trades", "E-commerce", "Startups"].map((t) => (
              <span key={t} className="text-slate-900 font-bold text-lg">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Everything Xero does.
              <br />
              <span style={{ color: TEAL }}>For a third of the price.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No hidden add-ons. No per-employee fees. Just clean, AI-powered accounting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🏦"
              title="Bank feeds, sorted"
              desc="Connects to all Australian banks automatically via Open Banking (CDR). Transactions flow in, get matched, and categorised by AI."
            />
            <FeatureCard
              icon="📋"
              title="BAS done in seconds"
              desc="Every transaction auto-classified for GST. Your BAS populates itself. Lodge directly to the ATO — no accountant middleman required."
            />
            <FeatureCard
              icon="💡"
              title="Know your money"
              desc="Set spending rules. See cashflow forecasts. Get AI insights like 'set aside $3,200 for GST this quarter'. Always know where you stand."
            />
            <FeatureCard
              icon="📸"
              title="Snap receipts, done"
              desc="Take a photo of any receipt in any language. AI extracts merchant, amount, date, GST, and files it automatically. No manual entry."
            />
            <FeatureCard
              icon="📊"
              title="Invoicing that gets paid"
              desc="Create professional tax invoices in seconds. Send via email. Accept bank transfer or card. Auto-match when payment lands."
            />
            <FeatureCard
              icon="🧠"
              title="AI tax advisor"
              desc="'You're on track to owe $8,400 this quarter. Prepay $2,100 in super before June 30 to reduce it.' Always working in the background."
            />
          </div>
        </div>
      </section>

      {/* ── MONEY RULES (DIFFERENTIATOR) ── */}
      <section className="py-20 md:py-28 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-amber-200">
                ⚡ Only on Ledgable
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Money Rules™
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Set percentage-based rules for every dollar that comes in. Ledgable automatically tracks
                whether you&apos;re on target — so you always know if the business is healthy.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Operating Costs", pct: 40, actual: 38, color: TEAL },
                  { name: "Tax Reserve", pct: 25, actual: 22, color: AMBER },
                  { name: "Owner Pay", pct: 20, actual: 21, color: "#6366F1" },
                  { name: "Growth Fund", pct: 15, actual: 19, color: "#EC4899" },
                ].map((r) => (
                  <div key={r.name} className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-900">{r.name}</span>
                      <span className="text-slate-500">
                        {r.actual}% of {r.pct}% target
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((r.actual / r.pct) * 100, 100)}%`,
                          background: r.actual > r.pct ? "#EF4444" : r.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-teal-900 rounded-2xl p-8 md:p-10 text-white">
              <div className="text-teal-300 text-sm font-medium mb-2">AI Insight</div>
              <p className="text-xl font-semibold leading-relaxed mb-4">
                &ldquo;Your Growth Fund is 4% over target this month. Consider redirecting $1,200 to Tax Reserve
                before your next BAS is due on April 28.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-teal-800">
                <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-sm">🧠</div>
                <div>
                  <div className="text-sm font-semibold">Ledgable AI</div>
                  <div className="text-xs text-teal-400">Based on your last 90 days of data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR AUSTRALIA ── */}
      <section id="australia" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Built for 🇦🇺 Australia
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            Not a US app with an Australian skin. Every feature is built from the ground up for Australian tax law.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: "✅", label: "GST auto-classification" },
              { icon: "📋", label: "BAS auto-preparation" },
              { icon: "🏛️", label: "ATO lodgment via SBR" },
              { icon: "💰", label: "Single Touch Payroll" },
              { icon: "🏦", label: "CDR Open Banking" },
              { icon: "📅", label: "July–June financial year" },
              { icon: "🧾", label: "Tax invoice format" },
              { icon: "💳", label: "PAYG withholding" },
              { icon: "🤖", label: "AI receipt scanner" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-teal-50 rounded-xl p-4 border border-teal-100 text-left hover:bg-teal-100 transition-colors"
              >
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold text-teal-900">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 md:py-28 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Simple pricing. No surprises.
            </h2>
            <p className="text-lg text-slate-600">Every plan includes GST, bank feeds, and BAS. No add-on fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-4 items-start">
            <PricingCard
              name="Solo"
              price="9"
              desc="Freelancers & sole traders"
              cta="Start free trial"
              features={[
                "1 user",
                "Bank feeds — all AU banks",
                "AI receipt scanning",
                "GST tracking & BAS prep",
                "Unlimited transactions",
                "Email support",
              ]}
            />
            <PricingCard
              name="Business"
              price="19"
              desc="Small businesses & growing teams"
              cta="Start free trial"
              popular
              features={[
                "Up to 5 users",
                "Everything in Solo",
                "Invoicing & quotes",
                "Money Rules budgeting",
                "Cashflow forecasting",
                "AI tax advisor",
                "ATO BAS lodgment",
                "Priority support",
              ]}
            />
            <PricingCard
              name="Pro"
              price="29"
              desc="Established businesses"
              cta="Start free trial"
              features={[
                "Unlimited users",
                "Everything in Business",
                "Single Touch Payroll",
                "Multi-entity",
                "Accountant portal",
                "API access",
                "Dedicated support",
              ]}
            />
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">
            Prices in AUD, inc. GST. 14-day free trial on all plans. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ledgable vs Xero
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-slate-50 text-sm font-semibold text-slate-500 p-4 border-b border-slate-200">
              <div>Feature</div>
              <div className="text-center" style={{ color: TEAL }}>Ledgable</div>
              <div className="text-center">Xero</div>
            </div>
            {[
              ["Starting price", "$9/mo", "$33/mo"],
              ["Bank feeds", "✅ All plans", "✅ All plans"],
              ["GST auto-classify", "✅ AI-powered", "❌ Manual coding"],
              ["BAS lodgment", "✅ Built-in", "✅ Via accountant"],
              ["Receipt scanning", "✅ AI — any language", "⚠️ Add-on (Hubdoc)"],
              ["Cashflow forecast", "✅ All plans", "⚠️ Premium only"],
              ["Money Rules", "✅ Unique", "❌"],
              ["AI tax advice", "✅ Built-in", "❌"],
              ["Payroll (STP)", "✅ Pro plan", "⚠️ Add-on cost"],
            ].map(([feat, us, them]) => (
              <div key={feat} className="grid grid-cols-3 p-4 border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors">
                <div className="text-slate-700 font-medium">{feat}</div>
                <div className="text-center text-slate-900">{us}</div>
                <div className="text-center text-slate-500">{them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-4" style={{ background: TEAL_DARK }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Stop overpaying for accounting
          </h2>
          <p className="text-lg text-teal-200 mb-10 max-w-xl mx-auto">
            Join hundreds of Australian businesses who switched to smarter, cheaper, AI-powered accounting.
          </p>
          <Link
            href="/enter"
            className="inline-block px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
            style={{ background: AMBER, color: "#78350F" }}
          >
            Start your free trial →
          </Link>
          <p className="text-sm text-teal-400 mt-4">No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-4 bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-extrabold text-xs" style={{ background: TEAL }}>
                  L
                </div>
                <span className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  ledgable
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                AI-powered accounting built for Australian businesses. Simple. Smart. Affordable.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="text-white font-semibold mb-3">Product</div>
                <div className="space-y-2">
                  <a href="#features" className="block hover:text-white transition-colors">Features</a>
                  <a href="#pricing" className="block hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="block hover:text-white transition-colors">Roadmap</a>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold mb-3">Company</div>
                <div className="space-y-2">
                  <a href="#" className="block hover:text-white transition-colors">About</a>
                  <a href="#" className="block hover:text-white transition-colors">Blog</a>
                  <a href="mailto:hello@ledgable.co" className="block hover:text-white transition-colors">Contact</a>
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
            <span>© {new Date().getFullYear()} Ledgable. Part of the Lineage HQ portfolio.</span>
            <span>Made in 🇦🇺 Australia · ABN coming soon</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
