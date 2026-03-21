"use client"

import { useState } from "react"

type Client = {
  id: string; name: string; email: string; status: 'active' | 'invited' | 'overdue';
  mrr: number; lastActivity: string; health: 'green' | 'yellow' | 'red';
}

export default function AccountantPortal() {
  const [clients] = useState<Client[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [tab, setTab] = useState<'overview' | 'clients' | 'revenue' | 'tools'>('overview')

  const totalMRR = clients.reduce((s, c) => s + (c.status === 'active' ? 5 : 0), 0)
  const activeCount = clients.filter(c => c.status === 'active').length

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Accountant Portal</h1>
          <p className="text-sm text-muted-foreground">Manage clients and earn $5/mo per active subscription</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
          + Add Client
        </button>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <RevCard icon="💰" label="Monthly Revenue" value={`$${totalMRR}`} sub={`$5 × ${activeCount} clients`} color="emerald" />
        <RevCard icon="👥" label="Active Clients" value={`${activeCount}`} sub="Paying subscribers" color="blue" />
        <RevCard icon="📨" label="Pending Invites" value={`${clients.filter(c => c.status === 'invited').length}`} sub="Awaiting signup" color="amber" />
        <RevCard icon="⚠️" label="Needs Attention" value={`${clients.filter(c => c.health === 'red').length}`} sub="Overdue or inactive" color="red" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {(['overview', 'clients', 'revenue', 'tools'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue Growth Chart Placeholder */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Revenue Growth</h3>
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <p>Add your first client to start tracking revenue</p>
                <p className="text-xs mt-1">Each client generates $5/mo in passive income</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h3 className="font-semibold text-emerald-400 mb-4">How the Partner Program Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step num={1} title="Invite Client" desc="Send an invite via email. Client signs up with your referral code automatically embedded." />
              <Step num={2} title="Client Subscribes" desc="Client pays $19/mo for Ledgable. No extra cost to them — same price as direct signup." />
              <Step num={3} title="You Earn $5/mo" desc="$5 per active client, every month, deposited automatically via Stripe Connect." />
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-500/20">
              <p className="text-sm text-emerald-300/80">
                <strong>100 clients = $500/mo passive income.</strong> Your clients get better software, you get a revenue stream.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'clients' && (
        <div className="rounded-xl border border-border bg-card">
          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Invite your first client to start earning</p>
              <button onClick={() => setShowInvite(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
                Invite Client
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <div className="grid grid-cols-12 gap-4 p-3 text-xs text-muted-foreground uppercase tracking-wider">
                <div className="col-span-1">Status</div>
                <div className="col-span-3">Client</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Last Active</div>
                <div className="col-span-1">Health</div>
                <div className="col-span-2 text-right">Revenue</div>
              </div>
              {clients.map(c => (
                <div key={c.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-accent/50">
                  <div className="col-span-1"><StatusDot status={c.status} /></div>
                  <div className="col-span-3 font-medium text-sm">{c.name}</div>
                  <div className="col-span-3 text-sm text-muted-foreground">{c.email}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{c.lastActivity}</div>
                  <div className="col-span-1"><HealthDot health={c.health} /></div>
                  <div className="col-span-2 text-right font-mono text-sm">${c.mrr}/mo</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Payout History</h3>
              <div className="text-center py-8 text-muted-foreground text-sm">
                <div className="text-3xl mb-2">💳</div>
                <p>No payouts yet</p>
                <p className="text-xs mt-1">Payouts are processed monthly via Stripe Connect</p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Revenue Projection</h3>
              <div className="space-y-3">
                <ProjectionRow clients={10} />
                <ProjectionRow clients={50} />
                <ProjectionRow clients={100} />
                <ProjectionRow clients={500} />
              </div>
            </div>
          </div>

          {/* Stripe Connect Setup */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">💳</div>
              <div>
                <h3 className="font-semibold">Payment Setup</h3>
                <p className="text-xs text-muted-foreground">Connect Stripe to receive automatic monthly payouts</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-500">
              Connect Stripe Account
            </button>
          </div>
        </div>
      )}

      {tab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolCard icon="📥" title="Bulk Import Clients" desc="Upload a CSV with client names and emails to send batch invitations." action="Upload CSV" />
          <ToolCard icon="📋" title="Deadline Tracker" desc="Track BAS due dates, tax returns, and compliance deadlines for all clients." action="Coming Soon" disabled />
          <ToolCard icon="📁" title="Document Requests" desc="Request documents from clients directly through the portal." action="Coming Soon" disabled />
          <ToolCard icon="📊" title="Client Reports" desc="Generate consolidated reports across your entire client book." action="Coming Soon" disabled />
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowInvite(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Invite Client</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Client Name</label>
                <input value={inviteName} onChange={e => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Business name" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Client Email</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="client@business.com" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm">Cancel</button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RevCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  const bg: Record<string, string> = { emerald: 'border-emerald-500/20 bg-emerald-500/5', blue: 'border-blue-500/20 bg-blue-500/5', amber: 'border-amber-500/20 bg-amber-500/5', red: 'border-red-500/20 bg-red-500/5' }
  return (
    <div className={`rounded-xl border ${bg[color]} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span><span>{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  )
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold flex-shrink-0">{num}</div>
      <div><div className="font-medium text-sm">{title}</div><div className="text-xs text-muted-foreground mt-1">{desc}</div></div>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const c: Record<string, string> = { active: 'bg-emerald-400', invited: 'bg-amber-400', overdue: 'bg-red-400' }
  return <div className={`w-2.5 h-2.5 rounded-full ${c[status] || c.active}`} />
}

function HealthDot({ health }: { health: string }) {
  const c: Record<string, string> = { green: '🟢', yellow: '🟡', red: '🔴' }
  return <span className="text-xs">{c[health] || c.green}</span>
}

function ProjectionRow({ clients }: { clients: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{clients} clients</span>
      <span className="font-mono font-bold text-emerald-400">${clients * 5}/mo</span>
    </div>
  )
}

function ToolCard({ icon, title, desc, action, disabled }: { icon: string; title: string; desc: string; action: string; disabled?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      <button disabled={disabled} className={`px-4 py-2 rounded-lg text-sm ${disabled ? 'bg-accent text-muted-foreground cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
        {action}
      </button>
    </div>
  )
}
