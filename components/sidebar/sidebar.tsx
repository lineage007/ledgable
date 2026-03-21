"use client"

import { useNotification } from "@/app/(app)/context"
import { UploadButton } from "@/components/files/upload-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
import { ClockArrowUp, FileText, Gift, House, Import, LayoutDashboard, Settings, Upload, Landmark, Receipt, PiggyBank, TrendingUp, FileSpreadsheet, Sparkles, Users, FileInput } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { ColoredText } from "../ui/colored-text"
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

  // Hide sidebar on mobile when clicking an item
  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/256.png" alt="Logo" className="h-10 w-10 rounded-lg" width={40} height={40} />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-lg">
                <ColoredText>{config.app.title}</ColoredText>
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <UploadButton className="w-full mt-4 mb-2">
              <Upload className="h-4 w-4" />
              {open ? <span>Upload</span> : ""}
            </UploadButton>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItemWithHighlight href="/dashboard">
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <House />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>

                <SidebarMenuItemWithHighlight href="/transactions">
                  <SidebarMenuButton asChild>
                    <Link href="/transactions">
                      <FileText />
                      <span>Transactions</span>
                      {notification && notification.code === "sidebar.transactions" && notification.message && (
                        <Blinker />
                      )}
                      <span></span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>

                <SidebarMenuItemWithHighlight href="/unsorted">
                  <SidebarMenuButton asChild>
                    <Link href="/unsorted">
                      <ClockArrowUp />
                      <span>Unsorted</span>
                      {unsortedFilesCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {unsortedFilesCount}
                        </span>
                      )}
                      {notification && notification.code === "sidebar.unsorted" && notification.message && <Blinker />}
                      <span></span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/contacts">
                  <SidebarMenuButton asChild>
                    <Link href="/contacts">
                      <Users />
                      <span>Contacts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/accounts">
                  <SidebarMenuButton asChild>
                    <Link href="/accounts">
                      <LayoutDashboard />
                      <span>Chart of Accounts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/bank-feeds">
                  <SidebarMenuButton asChild>
                    <Link href="/bank-feeds">
                      <Landmark />
                      <span>Bank Feeds</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/gst">
                  <SidebarMenuButton asChild>
                    <Link href="/gst">
                      <Receipt />
                      <span>GST & BAS</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/money-rules">
                  <SidebarMenuButton asChild>
                    <Link href="/money-rules">
                      <PiggyBank />
                      <span>Money Rules</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/cashflow">
                  <SidebarMenuButton asChild>
                    <Link href="/cashflow">
                      <TrendingUp />
                      <span>Cashflow</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/invoices/list">
                  <SidebarMenuButton asChild>
                    <Link href="/invoices/list">
                      <FileSpreadsheet />
                      <span>Invoices</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/ask">
                  <SidebarMenuButton asChild>
                    <Link href="/ask">
                      <Sparkles />
                      <span>Ask Ledge</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/accountant">
                  <SidebarMenuButton asChild>
                    <Link href="/accountant">
                      <Users />
                      <span>Accountant</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/migrate">
                  <SidebarMenuButton asChild>
                    <Link href="/migrate">
                      <FileInput />
                      <span>Import Data</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/apps">
                  <SidebarMenuButton asChild>
                    <Link href="/apps">
                      <LayoutDashboard />
                      <span>Apps</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
                <SidebarMenuItemWithHighlight href="/settings">
                  <SidebarMenuButton asChild>
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItemWithHighlight>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/import/csv">
                      <Import />
                      Import from CSV
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {isSelfHosted && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="https://ledgable.co" target="_blank">
                        <Gift />
                        Thank the author
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {!open && (
                  <SidebarMenuItem>
                    <SidebarTrigger />
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUser profile={profile} isSelfHosted={isSelfHosted} />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
