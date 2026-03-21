import { getCurrentUser } from "@/lib/auth"
import { getCategories } from "@/models/categories"
import { getCurrencies } from "@/models/currencies"
import { getSettings } from "@/models/settings"
import { SettingsGeneral } from "./settings-general"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)
  const currencies = await getCurrencies(user.id)
  const categories = await getCategories(user.id)

  return <SettingsGeneral settings={settings} currencies={currencies} categories={categories} />
}
export const dynamic = "force-dynamic"
