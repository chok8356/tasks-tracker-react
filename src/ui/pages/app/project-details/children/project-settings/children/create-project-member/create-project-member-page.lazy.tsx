import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { inviteMember } from '@/infra/memberships/invite-member'
import { CreateProjectMemberPage } from '@/ui/pages/app/project-details/children/project-settings/children/create-project-member/create-project-member-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createProjectMemberLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_MEMBERS_CREATE)
    return (
      <CreateProjectMemberPage
        deps={{
          getCurrentUserRole,
          inviteMember,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
