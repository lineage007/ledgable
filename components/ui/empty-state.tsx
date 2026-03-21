import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Plus, Receipt, Users, Landmark, TrendingUp, Sparkles } from "lucide-react"

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description: string
  actions?: { label: string; href: string; icon?: React.ReactNode; variant?: 'default' | 'outline' }[]
  tip?: string
}

const ILLUSTRATIONS: Record<string, React.ReactNode> = {
  transactions: (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <FileText className="w-10 h-10 text-primary/40" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Plus className="w-4 h-4 text-primary/60" />
      </div>
    </div>
  ),
  receipts: (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 flex items-center justify-center">
        <Receipt className="w-10 h-10 text-violet-400/40" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-violet-400/60" />
      </div>
    </div>
  ),
  invoices: (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
        <FileText className="w-10 h-10 text-emerald-400/40" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <span className="text-[10px] font-bold text-emerald-500">$</span>
      </div>
    </div>
  ),
  contacts: (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center">
        <Users className="w-10 h-10 text-blue-400/40" />
      </div>
    </div>
  ),
  bankFeeds: (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center">
        <Landmark className="w-10 h-10 text-amber-400/40" />
      </div>
    </div>
  ),
}

export function EmptyStateLarge({ icon, title, description, actions, tip }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-8">
      {icon || ILLUSTRATIONS.transactions}
      <h3 className="text-lg font-semibold mt-2 mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {actions && actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((a, i) => (
            <Button key={i} variant={a.variant || (i === 0 ? 'default' : 'outline')} asChild>
              <Link href={a.href} className="flex items-center gap-2">
                {a.icon} {a.label}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {tip && (
        <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>{tip}</span>
        </div>
      )}
    </div>
  )
}

export { ILLUSTRATIONS }
