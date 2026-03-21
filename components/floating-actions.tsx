"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, Plus, Upload, FileText, Receipt, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

const QUICK_ACTIONS = [
  { label: "Upload Receipt", href: "/unsorted", icon: Upload, color: "bg-violet-500" },
  { label: "New Invoice", href: "/invoices/create", icon: FileText, color: "bg-emerald-500" },
  { label: "Add Expense", href: "/transactions", icon: Receipt, color: "bg-amber-500" },
  { label: "New Contact", href: "/contacts", icon: Users, color: "bg-blue-500" },
]

const SUGGESTIONS = [
  "How much GST do I owe this quarter?",
  "Show my top expenses this month",
  "Am I on track for my BAS?",
  "What invoices are overdue?",
]

export function FloatingActions() {
  const [showChat, setShowChat] = useState(false)
  const [showQuick, setShowQuick] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm Ledge, your AI bookkeeper. Ask me anything about your finances, or tell me what you need done." }
  ])
  const chatEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (showChat) inputRef.current?.focus()
  }, [showChat])

  const handleSend = () => {
    if (!message.trim()) return
    setMessages(m => [...m, { role: "user", text: message }])
    const q = message
    setMessage("")
    // Simulate AI response
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: `I'm looking into "${q}" for you. This feature connects to your real financial data once your AI provider is configured in Settings → AI Provider.` }])
    }, 800)
  }

  return (
    <>
      {/* Quick Actions FAB */}
      <div className="fixed bottom-24 right-5 z-40 md:bottom-6 md:right-6">
        {showQuick && (
          <div className="mb-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {QUICK_ACTIONS.map(a => (
              <Link key={a.label} href={a.href}
                onClick={() => setShowQuick(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
                <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center`}>
                  <a.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{a.label}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={() => { setShowQuick(!showQuick); setShowChat(false) }}
          className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
            showQuick ? "bg-muted-foreground text-background rotate-45" : "bg-primary text-primary-foreground"
          }`}>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* AI Chat FAB */}
      <div className="fixed bottom-6 right-5 z-50 md:right-6">
        {showChat && (
          <div className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Ledge AI</div>
                  <div className="text-[10px] text-white/70">Your AI bookkeeper</div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => { setMessage(s); setTimeout(handleSend, 50) }}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-border flex items-center gap-2">
              <input
                ref={inputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask Ledge anything..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={handleSend}
                className={`p-2 rounded-lg transition-colors ${message.trim() ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => { setShowChat(!showChat); setShowQuick(false) }}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
            showChat
              ? "bg-muted-foreground text-background"
              : "bg-gradient-to-br from-teal-500 to-emerald-600 text-white"
          }`}>
          {showChat ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </button>
      </div>
    </>
  )
}
