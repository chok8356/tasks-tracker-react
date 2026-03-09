import { createIssueType } from '@/infra/issue-types/create-issue-type'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { CreateIssueTypePage } from '@/ui/pages/app/project-details/children/project-settings/children/create-issue-type/create-issue-type-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createIssueTypeLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_CREATE,
    )
    return (
      <CreateIssueTypePage
        deps={{
          createIssueType,
          getCurrentUserRole,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
