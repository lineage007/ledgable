import { getCurrentUser } from "@/lib/auth"
import { getFields } from "@/models/fields"
import { FieldsClient } from "./client"

export default async function FieldsSettingsPage() {
  const user = await getCurrentUser()
  const fields = await getFields(user.id)

  return (
    <FieldsClient
      fields={fields.map(f => ({
        ...f,
        isEditable: true,
        isDeletable: f.isExtra,
      }))}
    />
  )
}
export const dynamic = "force-dynamic"
