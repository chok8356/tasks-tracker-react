import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { deleteProject } from '@/infra/projects/delete-project'
import { ProjectSettingsPage } from '@/ui/pages/app/project-details/children/project-settings/project-settings-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectSettingsLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectSettingsPage
        deps={{
          deleteProject,
          getCurrentUserRole,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
