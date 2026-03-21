"use client"

import { useNotification } from "@/app/(app)/context"
import { UploadButton } from "@/components/files/upload-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserProfile } from "@/lib/auth"
import config from "@/lib/config"
import {
  LayoutDashboard, FileText, ClockArrowUp, Landmark, Receipt, TrendingUp,
  FileSpreadsheet, Users, PiggyBank, Sparkles, Settings, Upload, ChevronRight,
  BarChart3, BookOpen, ArrowRightLeft, UserCheck, FolderInput
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { Blinker } from "./blinker"
import { SidebarMenuItemWithHighlight } from "./sidebar-item"
import SidebarUser from "./sidebar-user"

export function AppSidebar({
  profile,
  unsortedFilesCount,
  isSelfHosted,
}: {
  profile: UserProfile
  unsortedFilesCount: number
  isSelfHosted: boolean
}) {
  const { open, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const { notification } = useNotification()

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3 px-1 py-1">
          <Image src="/logo/256.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
          {open && (
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="text-white">ledg</span><span style={{ color: '#5EEAD4' }}>able</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Upload */}
        <SidebarGroup className="px-3 py-2">
          <UploadButton className="w-full bg-sidebar-primary/10 hover:bg-sidebar-primary/20 text-sidebar-primary border-sidebar-primary/20 border">
            <Upload className="h-4 w-4" />
            {open && <span className="text-sm font-medium">Upload Receipt</span>}
          </UploadButton>
        </SidebarGroup>

        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold px-4">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem href="/ask" icon={Sparkles} label="Ask Ledge AI" badge="AI" badgeColor="teal" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Accounting */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold px-4">
            Accounting
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/transactions" icon={ArrowRightLeft} label="Transactions"
                notification={notification?.code === "sidebar.transactions"} />
              <NavItem href="/unsorted" icon={ClockArrowUp} label="Unsorted"
                count={unsortedFilesCount}
                notification={notification?.code === "sidebar.unsorted"} />
              <NavItem href="/bank-feeds" icon={Landmark} label="Bank Feeds" />
              <NavItem href="/invoices/list" icon={FileSpreadsheet} label="Invoices" />
              <NavItem href="/contacts" icon={Users} label="Contacts" />
              <NavItem href="/accounts" icon={BookOpen} label="Chart of Accounts" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports & Tax */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold px-4">
            Reports & Tax
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/gst" icon={Receipt} label="GST & BAS" />
              <NavItem href="/cashflow" icon={TrendingUp} label="Cash Flow" />
              <NavItem href="/money-rules" icon={PiggyBank} label="Money Rules" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/40 font-semibold px-4">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem href="/accountant" icon={UserCheck} label="Accountant Portal" />
              <NavItem href="/migrate" icon={FolderInput} label="Import / Migrate" />
              <NavItem href="/settings" icon={Settings} label="Settings" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!open && (
                <SidebarMenuItem>
                  <SidebarTrigger />
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarUser profile={profile} isSelfHosted={isSelfHosted} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavItem({
  href, icon: Icon, label, count, notification, badge, badgeColor
}: {
  href: string; icon: any; label: string; count?: number; notification?: boolean; badge?: string; badgeColor?: string
}) {
  return (
    <SidebarMenuItemWithHighlight href={href}>
      <SidebarMenuButton asChild>
        <Link href={href}>
          <Icon className="h-4 w-4" />
          <span className="text-[13px]">{label}</span>
          {count && count > 0 ? (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/20 text-[10px] font-bold text-sidebar-primary px-1.5">
              {count}
            </span>
          ) : null}
          {badge ? (
            <span className="ml-auto rounded-md bg-sidebar-primary/15 text-sidebar-primary text-[10px] font-bold px-1.5 py-0.5 tracking-wide">
              {badge}
            </span>
          ) : null}
          {notification && <Blinker />}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemWithHighlight>
  )
}
