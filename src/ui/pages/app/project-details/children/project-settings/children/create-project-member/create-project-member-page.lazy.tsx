import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { inviteMemberUseCase } from '@/app/use-cases/memberships/invite-member'
import { CreateProjectMemberPage } from '@/ui/pages/app/project-details/children/project-settings/children/create-project-member/create-project-member-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createProjectMemberLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_MEMBERS_CREATE)
    return (
      <CreateProjectMemberPage
        projectId={projectId}
        useCases={{
          getCurrentUserRoleUseCase,
          inviteMemberUseCase,
        }}
      />
    )
  }
  return { Component }
}
