import { createIssueStatus } from '@/infra/issue-statuses/create-issue-status'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { CreateIssueStatusPage } from '@/ui/pages/app/project-details/children/project-settings/children/create-issue-status/create-issue-status-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createIssueStatusLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_CREATE,
    )
    return (
      <CreateIssueStatusPage
        deps={{
          createIssueStatus,
          getCurrentUserRole,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
