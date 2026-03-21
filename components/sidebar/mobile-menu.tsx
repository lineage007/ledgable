"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

export default function MobileMenu({ unsortedFilesCount }: { unsortedFilesCount: number }) {
  const { toggleSidebar } = useSidebar()

  return (
    <menu className="flex flex-row gap-2 p-2.5 px-4 items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-border bg-background/95 backdrop-blur-sm md:hidden">
      <Avatar className="h-10 w-10 cursor-pointer" onClick={toggleSidebar}>
        <AvatarImage src="/logo/256.png" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
      <Link href="/dashboard" className="flex items-center">
        <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <span className="text-foreground">ledg</span><span style={{ color: '#0D9488' }}>able</span>
        </span>
      </Link>
      <Link
        href="/unsorted"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
      >
        {unsortedFilesCount}
      </Link>
    </menu>
  )
}
