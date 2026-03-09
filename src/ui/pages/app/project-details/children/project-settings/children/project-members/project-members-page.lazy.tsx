import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { getMemberships } from '@/infra/memberships/get-memberships'
import { removeMember } from '@/infra/memberships/remove-member'
import { ProjectMembersPage } from '@/ui/pages/app/project-details/children/project-settings/children/project-members/project-members-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectMembersLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_MEMBERS)
    return (
      <ProjectMembersPage
        deps={{
          getCurrentUserRole,
          getMemberships,
          removeMember,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
