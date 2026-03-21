import { prisma } from "@/lib/db"
import config from "@/lib/config"
import { getSelfHostedUser } from "@/models/users"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const selfHosted = config.selfHosted.isEnabled
    const user = await getSelfHostedUser()
    const txnCount = user ? await prisma.transaction.count({ where: { userId: user.id } }) : 0
    const catCount = user ? await prisma.category.count({ where: { userId: user.id } }) : 0
    
    return NextResponse.json({
      status: "ok",
      selfHosted,
      user: user ? { id: user.id, email: user.email } : null,
      counts: { transactions: txnCount, categories: catCount },
      dbUrl: process.env.DATABASE_URL ? "set" : "missing",
      baseUrl: process.env.BASE_URL || "not set",
    })
  } catch (e: any) {
    return NextResponse.json({ 
      status: "error", 
      error: e.message,
      stack: e.stack?.split('\n').slice(0,5)
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
