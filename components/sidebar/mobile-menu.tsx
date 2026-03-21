"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

export default function MobileMenu({ unsortedFilesCount }: { unsortedFilesCount: number }) {
  const { toggleSidebar } = useSidebar()

  return (
    <menu className="flex flex-row gap-2 p-2.5 items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-border bg-background/95 backdrop-blur-sm md:hidden">
      <Avatar className="h-9 w-9 rounded-lg cursor-pointer" onClick={toggleSidebar}>
        <AvatarImage src="/logo/donut-64.png" />
        <AvatarFallback className="rounded-lg">L</AvatarFallback>
      </Avatar>
      <Link href="/dashboard">
        <Image src="/logo/wordmark.png" alt="Ledgable" width={110} height={28} className="h-7 w-auto" />
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
