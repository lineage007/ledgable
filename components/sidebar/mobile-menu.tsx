"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"

export default function MobileMenu({ unsortedFilesCount }: { unsortedFilesCount: number }) {
  const { toggleSidebar } = useSidebar()

  return (
    <menu className="flex flex-row gap-2 p-2.5 px-4 items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-border bg-background/95 backdrop-blur-sm md:hidden">
      {/* Left: menu toggle (donut icon) */}
      <Avatar className="h-10 w-10 cursor-pointer shrink-0" onClick={toggleSidebar}>
        <AvatarImage src="/logo/256.png" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>

      {/* Center: wordmark — links to dashboard */}
      <Link href="/dashboard" className="flex items-center py-2 px-4 -mx-2 active:opacity-70 transition-opacity">
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="text-foreground">ledg</span><span style={{ color: '#0D9488' }}>able</span>
        </span>
      </Link>

      {/* Right: unsorted count + profile */}
      <div className="flex items-center gap-2 shrink-0">
        {unsortedFilesCount > 0 && (
          <Link
            href="/unsorted"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            {unsortedFilesCount}
          </Link>
        )}
        <Link
          href="/settings/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-accent/80 transition-colors"
        >
          <User className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>
    </menu>
  )
}
