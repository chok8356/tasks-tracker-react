import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { getMembershipsUseCase } from '@/app/use-cases/memberships/get-memberships'
import { removeMemberUseCase } from '@/app/use-cases/memberships/remove-member'
import { ProjectMembersPage } from '@/ui/pages/app/project-details/children/project-settings/children/project-members/project-members-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectMembersLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_MEMBERS)
    return (
      <ProjectMembersPage
        projectId={projectId}
        useCases={{
          getCurrentUserRoleUseCase,
          getMembershipsUseCase,
          removeMemberUseCase,
        }}
      />
    )
  }
  return { Component }
}
