"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, User, Building2, Tag, List, FolderOpen, Archive, AlertTriangle, Sparkles } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon?: string
  }[]
}

const ICONS: Record<string, React.ReactNode> = {
  "General": <Settings className="w-4 h-4" />,
  "Profile & Plan": <User className="w-4 h-4" />,
  "Business Details": <Building2 className="w-4 h-4" />,
  "AI Provider": <Sparkles className="w-4 h-4" />,
  "Categories": <Tag className="w-4 h-4" />,
  "Fields": <List className="w-4 h-4" />,
  "Projects": <FolderOpen className="w-4 h-4" />,
  "Backups": <Archive className="w-4 h-4" />,
  "Data Management": <AlertTriangle className="w-4 h-4" />,
}

export function SideNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-0.5", className)} {...props}>
      {/* Mobile: horizontal scroll pills */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-1 px-1 lg:hidden scrollbar-none">
        {items.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
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
        })}
      </div>

      {/* Desktop: vertical list */}
      <div className="hidden lg:flex lg:flex-col lg:gap-0.5">
        {items.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
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
        })}
      </div>
    </nav>
  )
}
