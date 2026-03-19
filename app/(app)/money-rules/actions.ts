"use server"

import { getSession } from "@/lib/auth"
import prisma from "@/prisma/client"
import { revalidatePath } from "next/cache"

const DEFAULT_RULES = [
  { name: "Household", percentage: 35, color: "#6366f1", icon: "🏠", sortOrder: 0 },
  { name: "Discretionary", percentage: 20, color: "#f59e0b", icon: "🛍️", sortOrder: 1 },
  { name: "Investment", percentage: 15, color: "#10b981", icon: "📈", sortOrder: 2 },
  { name: "Savings", percentage: 15, color: "#3b82f6", icon: "🏦", sortOrder: 3 },
  { name: "Bills & Subscriptions", percentage: 10, color: "#ef4444", icon: "📱", sortOrder: 4 },
  { name: "Giving", percentage: 5, color: "#ec4899", icon: "💝", sortOrder: 5 },
]

export async function getMoneyRules() {
  const session = await getSession()
  if (!session?.user?.id) return []
  
  const rules = await prisma.moneyRule.findMany({
    where: { userId: session.user.id },
    orderBy: { sortOrder: "asc" },
  })

  // Auto-create defaults if none exist
  if (rules.length === 0) {
    await prisma.moneyRule.createMany({
      data: DEFAULT_RULES.map(r => ({ ...r, userId: session.user.id, categories: [] })),
    })
    return prisma.moneyRule.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    })
  }

  return rules
}

export async function updateMoneyRule(id: string, data: { name?: string; percentage?: number; color?: string; icon?: string; categories?: string[] }) {
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Not authenticated")

  await prisma.moneyRule.update({
    where: { id },
    data: {
      name: data.name,
      percentage: data.percentage,
      color: data.color,
      icon: data.icon,
      categories: data.categories,
    },
  })

  revalidatePath("/money-rules")
}

export async function getMoneyRuleSummary() {
  const session = await getSession()
  if (!session?.user?.id) return { rules: [], totalSpend: 0, month: "" }

  const rules = await getMoneyRules()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Get this month's transactions grouped by money rule
  const transactions = await prisma.bankTransaction.findMany({
    where: {
      connection: { userId: session.user.id },
      date: { gte: monthStart },
      amount: { lt: 0 }, // expenses only
    },
  })

  const totalSpend = transactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

  const rulesWithSpend = rules.map(rule => {
    const ruleTransactions = transactions.filter(t => t.moneyRuleId === rule.id)
    const spent = ruleTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
    const target = totalSpend * (Number(rule.percentage) / 100)
    return {
      ...rule,
      spent,
      target,
      percentage: Number(rule.percentage),
      overBudget: spent > target,
    }
  })

  return {
    rules: rulesWithSpend,
    totalSpend,
    month: now.toLocaleString("en-AU", { month: "long", year: "numeric" }),
  }
}
