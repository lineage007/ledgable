import { addCategoryAction, deleteCategoryAction, editCategoryAction } from "@/app/(app)/settings/actions"
import { getCurrentUser } from "@/lib/auth"
import { randomHexColor } from "@/lib/utils"
import { getCategories } from "@/models/categories"
import { Prisma } from "@/prisma/client"
import { CategoriesClient } from "./client"

export default async function CategoriesSettingsPage() {
  const user = await getCurrentUser()
  const categories = await getCategories(user.id)

  return (
    <CategoriesClient
      categories={categories.map(c => ({
        ...c,
        isEditable: true,
        isDeletable: true,
      }))}
      userId={user.id}
    />
  )
}
export const dynamic = "force-dynamic"
