import { SideNav } from "@/components/settings/side-nav"
import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Ledgable preferences",
}

const settingsCategories = [
  {
    title: "General",
    href: "/settings",
  },
  {
    title: "Profile & Plan",
    href: "/settings/profile",
  },
  {
    title: "Business Details",
    href: "/settings/business",
  },
  {
    title: "Email Inbox",
    href: "/settings/email-inbox",
  },
  {
    title: "Backups",
    href: "/settings/backups",
  },
  {
    title: "Data Management",
    href: "/settings/danger",
  },
  {
    title: "— Advanced —",
    href: "#",
    separator: true,
  },
  {
    title: "Categories",
    href: "/settings/categories",
  },
  {
    title: "Fields",
    href: "/settings/fields",
  },
  {
    title: "Projects",
    href: "/settings/projects",
  },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 p-4 md:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your Ledgable preferences</p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SideNav items={settingsCategories} />
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
