"use client"

import { useState } from "react"
import { ArrowLeft, Mail, UserPlus, Link2, Shield, CheckCircle, Clock, AlertTriangle, Users, DollarSign, TrendingUp, FileText, Send, Search } from "lucide-react"
import Link from "next/link"

// This page is only accessible to users with role=accountant
// Regular users who navigate here see a "become a partner" page

type Client = {
  id: string; name: string; email: string; status: 'active' | 'invited' | 'linking' | 'overdue';
  lastActivity: string; health: 'green' | 'yellow' | 'red';
}

type AddMode = 'invite' | 'link' | null

export default function AccountantPortal() {
  const [isAccountant] = useState(true) // TODO: check actual role from session
  const [clients] = useState<Client[]>([])
  const [addMode, setAddMode] = useState<AddMode>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [linkEmail, setLinkEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [tab, setTab] = useState<'overview' | 'clients' | 'tools'>('overview')

  const activeCount = clients.filter(c => c.status === 'active').length
  const pendingCount = clients.filter(c => c.status === 'invited' || c.status === 'linking').length

  // Non-accountants see the partner signup page
  if (!isAccountant) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Ledgable Partner Program</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Are you an accountant or bookkeeper? Join our partner program to manage your clients on Ledgable and earn recurring revenue.
        </p>
        <button className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500">
          Apply to Become a Partner
        </button>
        <p className="text-xs text-muted-foreground mt-4">Free to join · No obligation · Cancel anytime</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Partner Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your client book</p>
        </div>
        <button onClick={() => setAddMode('invite')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
          + Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <StatCard icon={<Users className="w-4 h-4 text-blue-500" />} label="Active Clients" value={activeCount} sub="Connected accounts" />
        <StatCard icon={<Clock className="w-4 h-4 text-amber-500" />} label="Pending" value={pendingCount} sub="Awaiting confirmation" />
        <StatCard icon={<AlertTriangle className="w-4 h-4 text-red-500" />} label="Needs Attention" value={clients.filter(c => c.health === 'red').length} sub="Overdue or inactive" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {(['overview', 'clients', 'tools'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Two ways to add */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setAddMode('invite')}
              className="text-left rounded-xl border border-border bg-card p-5 hover:border-emerald-500/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <UserPlus className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-semibold">Invite New Client</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Send an invite to a client who isn&apos;t on Ledgable yet. They&apos;ll sign up with your referral linked automatically.
              </p>
            </button>

            <button onClick={() => setAddMode('link')}
              className="text-left rounded-xl border border-border bg-card p-5 hover:border-blue-500/40 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Link2 className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold">Link Existing Client</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Already have a client on Ledgable? Enter their email and they&apos;ll verify the connection. Works even if they&apos;re with another firm.
              </p>
            </button>
          </div>

          {/* How It Works */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="font-semibold text-emerald-500 mb-4">How the Partner Program Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StepCard num={1} title="Add Your Client" desc="Invite a new user or link an existing Ledgable account to your firm." />
              <StepCard num={2} title="Client Confirms" desc="New clients sign up normally. Existing clients verify the connection via email." />
              <StepCard num={3} title="Manage & Support" desc="View their books (read-only), lodge BAS on their behalf, track deadlines." />
            </div>
          </div>
        </div>
      )}

      {/* Clients List */}
      {tab === 'clients' && (
        <div className="rounded-xl border border-border bg-card">
          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Invite a new client or link an existing Ledgable user to get started</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setAddMode('invite')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500">
                  Invite New
                </button>
                <button onClick={() => setAddMode('link')} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                  Link Existing
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {clients.map(c => (
                <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-accent/50">
                  <StatusIndicator status={c.status} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                  </div>
                  <div className="text-xs text-muted-foreground hidden md:block">{c.lastActivity}</div>
                  <HealthBadge health={c.health} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tools */}
      {tab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard icon={<FileText className="w-5 h-5 text-emerald-500" />} title="Bulk Import" desc="Upload a CSV with client names and emails to send batch invitations." available />
          <ToolCard icon={<Shield className="w-5 h-5 text-blue-500" />} title="Deadline Tracker" desc="Track BAS due dates, tax returns, and compliance deadlines." available={false} />
          <ToolCard icon={<TrendingUp className="w-5 h-5 text-purple-500" />} title="Client Reports" desc="Generate consolidated reports across your entire client book." available={false} />
          <ToolCard icon={<DollarSign className="w-5 h-5 text-amber-500" />} title="Payout Settings" desc="Connect your Stripe account to receive monthly partner payouts." available />
        </div>
      )}

      {/* Add Client Modal — Invite New */}
      {addMode === 'invite' && (
        <Modal onClose={() => setAddMode(null)}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Invite New Client</h3>
              <p className="text-xs text-muted-foreground">They&apos;ll receive a signup link with your firm pre-linked</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Business Name</label>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="e.g. Smith Plumbing Pty Ltd" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Client Email</label>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" placeholder="accounts@smithplumbing.com.au" />
            </div>
            <div className="rounded-lg bg-accent/50 p-3">
              <p className="text-xs text-muted-foreground">
                <Mail className="w-3 h-3 inline mr-1" />
                Client will receive an email: <em>&quot;Your accountant [Your Firm] has invited you to Ledgable — smart accounting software built for Australian businesses.&quot;</em>
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setAddMode(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium">Cancel</button>
              <button className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Invite
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Client Modal — Link Existing */}
      {addMode === 'link' && (
        <Modal onClose={() => { setAddMode(null); setLinkSent(false); setLinkEmail('') }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Link Existing Client</h3>
              <p className="text-xs text-muted-foreground">Connect a client who already uses Ledgable</p>
            </div>
          </div>

          {!linkSent ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Client&apos;s Ledgable Email</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={linkEmail} onChange={e => setLinkEmail(e.target.value)} type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm"
                    placeholder="Enter the email they use on Ledgable" />
                </div>
              </div>

              <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-4 space-y-2">
                <p className="text-sm font-medium text-blue-400">How linking works:</p>
                <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>You enter your client&apos;s Ledgable account email</li>
                  <li>They receive an email: <em>&quot;[Your Firm] wants to become your accountant on Ledgable&quot;</em></li>
                  <li>They click <strong>Confirm</strong> to approve the connection</li>
                  <li>You gain read-only access to their books</li>
                </ol>
                <p className="text-xs text-muted-foreground pt-1">
                  If they&apos;re currently with another firm, they&apos;ll be asked to confirm the switch. Their data stays exactly the same — only the linked accountant changes.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setAddMode(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium">Cancel</button>
                <button onClick={() => setLinkSent(true)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" /> Send Verification
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <h4 className="font-semibold mb-2">Verification Sent!</h4>
              <p className="text-sm text-muted-foreground mb-1">
                We&apos;ve emailed <strong>{linkEmail}</strong>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                They need to click &quot;Confirm&quot; in the email to link their account to your firm. You&apos;ll see them appear in your Clients tab once they accept.
              </p>
              <button onClick={() => { setAddMode(null); setLinkSent(false); setLinkEmail('') }}
                className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500">
                Done
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

// ─── Sub-components ─────────────────────────────────────────

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  )
}

function StepCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">{num}</div>
      <div><div className="font-medium text-sm">{title}</div><div className="text-xs text-muted-foreground mt-1">{desc}</div></div>
    </div>
  )
}

function StatusIndicator({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-400',
    invited: 'bg-amber-400',
    linking: 'bg-blue-400 animate-pulse',
    overdue: 'bg-red-400',
  }
  return <div className={`w-2.5 h-2.5 rounded-full ${styles[status] || styles.active}`} />
}

function HealthBadge({ health }: { health: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: 'Healthy' },
    yellow: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'Review' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Attention' },
  }
  const s = styles[health] || styles.green
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
}

function ToolCard({ icon, title, desc, available }: { icon: React.ReactNode; title: string; desc: string; available: boolean }) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${available ? 'border-border' : 'border-border/50 opacity-60'}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold mb-1 text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{desc}</p>
      <button disabled={!available}
        className={`px-4 py-2 rounded-lg text-sm ${available ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-accent text-muted-foreground cursor-not-allowed'}`}>
        {available ? 'Set Up' : 'Coming Soon'}
      </button>
    </div>
  )
}
