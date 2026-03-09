import { deleteIssueType } from '@/infra/issue-types/delete-issue-type'
import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { IssueTypesPage } from '@/ui/pages/app/project-details/children/project-settings/children/issue-types/issue-types-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const issueTypesLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES)
    return (
      <IssueTypesPage
        deps={{
          deleteIssueType,
          getCurrentUserRole,
          getIssueTypes,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
