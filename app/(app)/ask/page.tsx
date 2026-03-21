"use client"

import { useState, useRef, useEffect } from "react"

type Message = { role: 'user' | 'assistant'; content: string; time: string }

const SUGGESTIONS = [
  "How much did I spend on software this month?",
  "Show me all overdue invoices",
  "What's my projected cash position in 60 days?",
  "Compare this quarter's revenue to last quarter",
  "Which category has the highest spend this year?",
  "Help me prepare my BAS for this quarter",
]

export default function AskLedgePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 I'm **Ledge**, your AI financial assistant. Ask me anything about your finances — spending patterns, forecasts, invoices, BAS preparation, or just \"how's my business doing?\"\n\nI have access to all your transactions, invoices, and bank data. Try asking me something!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text?: string) => {
    const q = text || input
    if (!q.trim()) return
    setInput('')
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { role: 'user', content: q, time: now }])
    setLoading(true)
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: "I don't have enough data to answer that yet. Connect your bank account or import some transactions, and I'll be able to help with detailed financial analysis.\n\n**Quick start:**\n- 🏦 Connect a bank via Bank Feeds\n- 📸 Upload receipts via the dashboard\n- 📥 Import from Xero/QuickBooks via Settings"
      }
      setMessages(m => [...m, { 
        role: 'assistant', 
        content: responses.default,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold">L</div>
          <div>
            <h1 className="font-semibold">Ask Ledge</h1>
            <p className="text-xs text-muted-foreground">AI-powered financial assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-md' 
                : 'bg-card border border-border rounded-bl-md'
            }`}>
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-emerald-200' : 'text-muted-foreground'}`}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Ask anything about your finances..." disabled={loading} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
