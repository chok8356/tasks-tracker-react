import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { deleteProjectUseCase } from '@/app/use-cases/projects/delete-project'
import { ProjectSettingsPage } from '@/ui/pages/app/project-details/children/project-settings/project-settings-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectSettingsLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectSettingsPage
        projectId={projectId}
        useCases={{
          deleteProjectUseCase,
          getCurrentUserRoleUseCase,
        }}
      />
    )
  }
  return { Component }
}
