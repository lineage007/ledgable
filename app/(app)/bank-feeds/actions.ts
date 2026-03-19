"use server"

import { getSession } from "@/lib/auth"
import prisma from "@/prisma/client"
import { revalidatePath } from "next/cache"

export async function getBankConnections() {
  const session = await getSession()
  if (!session?.user?.id) return []
  
  return prisma.bankConnection.findMany({
    where: { userId: session.user.id },
    include: { transactions: { take: 5, orderBy: { date: "desc" } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function addBankConnection(formData: FormData) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const institution = formData.get("institution") as string
  const accountName = formData.get("accountName") as string
  const accountBSB = formData.get("accountBSB") as string
  const accountNumber = formData.get("accountNumber") as string
  const balance = parseFloat(formData.get("balance") as string) || 0

  await prisma.bankConnection.create({
    data: {
      userId: session.user.id,
      institution,
      accountName,
      accountBSB,
      accountNumber,
      balance,
    },
  })

  revalidatePath("/bank-feeds")
}

export async function importBankCSV(connectionId: string, csvText: string) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const lines = csvText.split("\n").filter(l => l.trim())
  const header = lines[0].split(",").map(h => h.trim().toLowerCase())
  
  const dateIdx = header.findIndex(h => h.includes("date"))
  const descIdx = header.findIndex(h => h.includes("desc") || h.includes("narrative") || h.includes("details"))
  const amountIdx = header.findIndex(h => h.includes("amount") || h.includes("debit"))
  const balanceIdx = header.findIndex(h => h.includes("balance"))

  const transactions = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""))
    if (cols.length < 3) continue
    
    const dateStr = cols[dateIdx] || cols[0]
    const desc = cols[descIdx] || cols[1]
    const amount = parseFloat(cols[amountIdx] || cols[2]) || 0
    const balance = balanceIdx >= 0 ? parseFloat(cols[balanceIdx]) : undefined

    // Auto-detect GST (10% of amount for AU)
    const gstAmount = Math.abs(amount) / 11

    transactions.push({
      connectionId,
      date: new Date(dateStr),
      description: desc,
      amount,
      balance: balance || undefined,
      gstAmount,
      gstInclusive: true,
    })
  }

  if (transactions.length > 0) {
    await prisma.bankTransaction.createMany({ data: transactions })
  }

  revalidatePath("/bank-feeds")
  return { imported: transactions.length }
}

export async function getRecentTransactions(connectionId?: string, limit = 50) {
  const session = await getSession()
  if (!session?.user?.id) return []

  return prisma.bankTransaction.findMany({
    where: connectionId 
      ? { connectionId } 
      : { connection: { userId: session.user.id } },
    orderBy: { date: "desc" },
    take: limit,
    include: { connection: true, moneyRule: true },
  })
}
