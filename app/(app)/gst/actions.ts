"use server"

import { getSession } from "@/lib/auth"
import prisma from "@/prisma/client"
import { revalidatePath } from "next/cache"

export async function getGSTReturns() {
  const session = await getSession()
  if (!session?.user?.id) return []

  return prisma.gSTReturn.findMany({
    where: { userId: session.user.id },
    orderBy: { periodStart: "desc" },
  })
}

export async function calculateCurrentQuarterGST() {
  const session = await getSession()
  if (!session?.user?.id) return null

  const now = new Date()
  const quarterMonth = Math.floor(now.getMonth() / 3) * 3
  const periodStart = new Date(now.getFullYear(), quarterMonth, 1)
  const periodEnd = new Date(now.getFullYear(), quarterMonth + 3, 0)
  const period = `${now.getFullYear()}-Q${Math.floor(now.getMonth() / 3) + 1}`

  // Get all transactions this quarter
  const transactions = await prisma.bankTransaction.findMany({
    where: {
      connection: { userId: session.user.id },
      date: { gte: periodStart, lte: periodEnd },
    },
  })

  const income = transactions.filter(t => Number(t.amount) > 0)
  const expenses = transactions.filter(t => Number(t.amount) < 0)

  const totalSales = income.reduce((sum, t) => sum + Number(t.amount), 0)
  const gstOnSales = income.reduce((sum, t) => sum + Number(t.gstAmount || 0), 0)
  const totalPurchases = Math.abs(expenses.reduce((sum, t) => sum + Number(t.amount), 0))
  const gstOnPurchases = expenses.reduce((sum, t) => sum + Number(t.gstAmount || 0), 0)
  const netGST = gstOnSales - gstOnPurchases

  return {
    period,
    periodStart,
    periodEnd,
    totalSales,
    gstOnSales,
    totalPurchases,
    gstOnPurchases,
    netGST,
    status: "draft" as const,
  }
}

export async function saveGSTReturn(data: {
  period: string
  periodStart: Date
  periodEnd: Date
  totalSales: number
  gstOnSales: number
  totalPurchases: number
  gstOnPurchases: number
  netGST: number
}) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Not authenticated")

  await prisma.gSTReturn.upsert({
    where: { userId_period: { userId: session.user.id, period: data.period } },
    create: { userId: session.user.id, ...data },
    update: data,
  })

  revalidatePath("/gst")
}
