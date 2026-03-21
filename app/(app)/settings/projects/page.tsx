import { getCurrentUser } from "@/lib/auth"
import { getProjects } from "@/models/projects"
import { ProjectsClient } from "./client"

export default async function ProjectsSettingsPage() {
  const user = await getCurrentUser()
  const projects = await getProjects(user.id)

  return (
    <ProjectsClient
      projects={projects.map(p => ({
        ...p,
        isEditable: true,
        isDeletable: true,
      }))}
    />
  )
}
export const dynamic = "force-dynamic"
