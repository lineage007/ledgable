"use client"

import { useState } from "react"
import { Mail, Copy, Check, Shield, Zap, FileText, ArrowRight, RefreshCw, Inbox, ExternalLink } from "lucide-react"

export default function EmailInboxPage() {
  const [copied, setCopied] = useState(false)
  
  // In production this would come from the user's account
  const userEmail = "inbox-a7k9x@ledgable.co"
  
  const copyEmail = () => {
    navigator.clipboard.writeText(userEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-[#1A1A2E]">Email Inbox</h1>
      <p className="text-sm text-[#9CA3AF] mt-0.5 mb-6">Forward receipts and invoices to your unique Ledgable email — they&apos;re automatically scanned and logged by AI</p>

      {/* Your unique email */}
      <div className="rounded-xl border-2 border-[#0D9488]/30 bg-gradient-to-br from-[#0D9488]/5 to-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#0D9488]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Your Ledgable Inbox</p>
            <p className="text-[10px] text-[#9CA3AF]">Forward any receipt or invoice to this address</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] font-mono text-[15px] text-[#1A1A2E] tracking-wide">
            {userEmail}
          </div>
          <button onClick={copyEmail}
            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${
              copied 
                ? 'bg-[#16A34A] text-white' 
                : 'bg-[#0D9488] text-white hover:bg-[#0F766E]'
            }`}>
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 mb-6">
        <h3 className="font-semibold text-[#1A1A2E] mb-4">How it works</h3>
        <div className="space-y-4">
          <Step num={1} icon={<Mail className="w-4 h-4" />} title="Forward or send an email"
            desc="Forward a receipt, invoice, or bill from your email. Attachments (PDF, images) are automatically extracted." />
          <Step num={2} icon={<Zap className="w-4 h-4" />} title="AI scans and extracts"
            desc="Ledge AI reads the document — merchant name, date, amounts, GST, line items — and creates a draft transaction." />
          <Step num={3} icon={<FileText className="w-4 h-4" />} title="Review in Unsorted"
            desc="The transaction appears in your Unsorted inbox. Review, adjust if needed, then approve. Done." />
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 mb-6">
        <h3 className="font-semibold text-[#1A1A2E] mb-3">💡 Pro tips</h3>
        <ul className="space-y-2.5 text-sm text-[#4B5563]">
          <li className="flex gap-2">
            <span className="text-[#0D9488] shrink-0">•</span>
            <span><strong>Auto-forward from Gmail:</strong> Set up a filter to auto-forward receipts from specific senders (e.g., Uber, Xero, Amazon) straight to your Ledgable inbox</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#0D9488] shrink-0">•</span>
            <span><strong>BCC on payments:</strong> When paying a supplier, BCC your Ledgable email so the receipt is logged automatically</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#0D9488] shrink-0">•</span>
            <span><strong>Suppliers can send directly:</strong> Give this email to suppliers as your &quot;accounts&quot; address — invoices go straight into your books</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#0D9488] shrink-0">•</span>
            <span><strong>Works with photos:</strong> Snap a photo of a paper receipt, email it to this address — AI reads it just the same</span>
          </li>
        </ul>
      </div>

      {/* Auto-forward setup guide */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 mb-6">
        <h3 className="font-semibold text-[#1A1A2E] mb-3">Set up auto-forwarding from Gmail</h3>
        <ol className="space-y-2 text-sm text-[#4B5563]">
          <li className="flex gap-2"><span className="text-[#0D9488] font-mono text-xs font-bold bg-[#0D9488]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span> Open Gmail → Settings (⚙️) → See all settings → Filters</li>
          <li className="flex gap-2"><span className="text-[#0D9488] font-mono text-xs font-bold bg-[#0D9488]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span> Click &quot;Create a new filter&quot;</li>
          <li className="flex gap-2"><span className="text-[#0D9488] font-mono text-xs font-bold bg-[#0D9488]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span> In &quot;From&quot; enter the sender (e.g. <code className="bg-[#F1F3F5] px-1 rounded text-xs">noreply@uber.com</code>)</li>
          <li className="flex gap-2"><span className="text-[#0D9488] font-mono text-xs font-bold bg-[#0D9488]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span> Click &quot;Create filter&quot; → check &quot;Forward it to&quot; → enter <code className="bg-[#F1F3F5] px-1 rounded text-xs">{userEmail}</code></li>
          <li className="flex gap-2"><span className="text-[#0D9488] font-mono text-xs font-bold bg-[#0D9488]/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">5</span> Done! Every receipt from that sender goes straight to Ledgable 🎉</li>
        </ol>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Inbox className="w-4 h-4" />} label="Received" value="0" />
        <StatCard icon={<Zap className="w-4 h-4" />} label="Auto-processed" value="0" />
        <StatCard icon={<RefreshCw className="w-4 h-4" />} label="Pending review" value="0" />
      </div>

      <p className="text-xs text-[#9CA3AF] mt-4 flex items-center gap-1">
        <Shield className="w-3 h-3" /> Emails are processed securely and deleted after extraction. We never read personal emails — only forwarded receipts and invoices.
      </p>
    </div>
  )
}

function Step({ num, icon, title, desc }: { num: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] shrink-0">
          {icon}
        </div>
        {num < 3 && <div className="w-px h-full bg-[#E5E7EB] mt-1" />}
      </div>
      <div className="pb-4">
        <p className="text-sm font-semibold text-[#1A1A2E]">{title}</p>
        <p className="text-sm text-[#6B7280] mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
      <div className="flex justify-center text-[#9CA3AF] mb-1">{icon}</div>
      <div className="text-xl font-bold text-[#1A1A2E] font-mono">{value}</div>
      <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">{label}</div>
    </div>
  )
}
