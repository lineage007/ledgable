"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, User, Building2, Tag, List, FolderOpen, Archive, AlertTriangle, Mail } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    separator?: boolean
  }[]
}

const ICONS: Record<string, React.ReactNode> = {
  "General": <Settings className="w-4 h-4" />,
  "Profile & Plan": <User className="w-4 h-4" />,
  "Business Details": <Building2 className="w-4 h-4" />,
  "Email Inbox": <Mail className="w-4 h-4" />,
  "Categories": <Tag className="w-4 h-4" />,
  "Fields": <List className="w-4 h-4" />,
  "Projects": <FolderOpen className="w-4 h-4" />,
  "Backups": <Archive className="w-4 h-4" />,
  "Data Management": <AlertTriangle className="w-4 h-4" />,
}

export function SideNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  // Split into main and advanced
  const sepIdx = items.findIndex(i => i.separator)
  const mainItems = sepIdx >= 0 ? items.slice(0, sepIdx) : items
  const advancedItems = sepIdx >= 0 ? items.slice(sepIdx + 1) : []

  return (
    <nav className={cn("flex flex-col gap-0.5", className)} {...props}>
      {/* Mobile: horizontal scroll pills */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-1 px-1 lg:hidden scrollbar-none">
        {mainItems.map(item => (
          <NavPill key={item.href} item={item} pathname={pathname} />
        ))}
        {advancedItems.length > 0 && (
          <>
            <div className="w-px bg-[#E5E7EB] shrink-0 my-1" />
            {advancedItems.map(item => (
              <NavPill key={item.href} item={item} pathname={pathname} />
            ))}
          </>
        )}
      </div>

      {/* Desktop: vertical list */}
      <div className="hidden lg:flex lg:flex-col lg:gap-0.5">
        {mainItems.map(item => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
        {advancedItems.length > 0 && (
          <>
            <div className="mt-4 mb-2 px-3">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Advanced</p>
            </div>
            {advancedItems.map(item => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </>
        )}
      </div>
    </nav>
  )
}

function NavPill({ item, pathname }: { item: { href: string; title: string }; pathname: string }) {
  const active = pathname === item.href
  return (
    <Link href={item.href}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors",
        active
          ? "bg-[#0D9488] text-white shadow-sm"
          : "bg-[#F1F3F5] text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#1A1A2E]"
      )}>
      {ICONS[item.title]}
      {item.title}
    </Link>
  )
}

function NavLink({ item, pathname }: { item: { href: string; title: string }; pathname: string }) {
  const active = pathname === item.href
  return (
    <Link href={item.href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20"
          : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1A1A2E] border border-transparent"
      )}>
      <span className={active ? "text-[#0D9488]" : "text-[#9CA3AF]"}>{ICONS[item.title]}</span>
      {item.title}
    </Link>
  )
}
