"use client"

import { saveSettingsAction } from "@/app/(app)/settings/actions"
import { FormError } from "@/components/forms/error"
import { FormSelectCategory } from "@/components/forms/select-category"
import { FormSelectType } from "@/components/forms/select-type"
import { Button } from "@/components/ui/button"
import { Category, Currency } from "@/prisma/client"
import { CircleCheckBig, DollarSign, Lock, Settings2, FileText, Tag } from "lucide-react"
import { useActionState } from "react"

export function SettingsGeneral({
  settings,
  currencies,
  categories,
}: {
  settings: Record<string, string>
  currencies: Currency[]
  categories: Category[]
}) {
  const [saveState, saveAction, pending] = useActionState(saveSettingsAction, null)

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Currency Section */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 p-5 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Currency</h3>
            <p className="text-xs text-muted-foreground">Base currency for all transactions and invoices</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/50 border border-border">
            <span className="text-lg">🇦🇺</span>
            <div className="flex-1">
              <div className="text-sm font-semibold">Australian Dollar (AUD)</div>
              <div className="text-xs text-muted-foreground">All amounts displayed in AUD · GST-inclusive pricing</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border">
              <Lock className="w-3 h-3" />
              Default
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 px-1">
            Multi-currency support coming soon. Contact us if you need to invoice in USD, GBP, or other currencies.
          </p>
        </div>
      </div>

      {/* Defaults Section */}
      <form action={saveAction} className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 p-5 pb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Default Values</h3>
            <p className="text-xs text-muted-foreground">Pre-fill these values when creating new transactions</p>
          </div>
        </div>
        <div className="px-5 pb-5 space-y-4">
          {/* Hidden currency field — always AUD */}
          <input type="hidden" name="default_currency" value={settings.default_currency || "AUD"} />

          <div className="space-y-1.5">
            <FormSelectType
              title="Default Transaction Type"
              name="default_type"
              defaultValue={settings.default_type}
            />
          </div>

          <div className="space-y-1.5">
            <FormSelectCategory
              title="Default Category"
              name="default_category"
              defaultValue={settings.default_category}
              categories={categories}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={pending} size="sm">
              {pending ? "Saving..." : "Save Defaults"}
            </Button>
            {saveState?.success && (
              <p className="text-emerald-500 text-sm flex items-center gap-1.5">
                <CircleCheckBig className="w-4 h-4" />
                Saved
              </p>
            )}
          </div>
          {saveState?.error && <FormError>{saveState.error}</FormError>}
        </div>
      </form>

      {/* Quick Links */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-3">Quick Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a href="/settings/business" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors group">
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            <div>
              <div className="text-sm font-medium">Business Details</div>
              <div className="text-xs text-muted-foreground">ABN, address, logo</div>
            </div>
          </a>
          <a href="/settings/fields" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors group">
            <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
            <div>
              <div className="text-sm font-medium">Custom Fields</div>
              <div className="text-xs text-muted-foreground">Add custom data to transactions</div>
            </div>
          </a>
          <a href="/settings/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors group">
            <Tag className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            <div>
              <div className="text-sm font-medium">Categories</div>
              <div className="text-xs text-muted-foreground">Manage expense categories</div>
            </div>
          </a>
          <a href="/settings/backups" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors group">
            <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <div>
              <div className="text-sm font-medium">Backups</div>
              <div className="text-xs text-muted-foreground">Export your data</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
