import { getIssueStatuses } from '@/infra/issue-statuses/get-issue-statuses'
import { updateIssueStatus } from '@/infra/issue-statuses/update-issue-status'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { EditIssueStatusPage } from '@/ui/pages/app/project-details/children/project-settings/children/edit-issue-status/edit-issue-status-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const editIssueStatusLazyLoader = async () => {
  function Component() {
    const { projectId, statusId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_EDIT,
    )
    return (
      <EditIssueStatusPage
        deps={{
          getCurrentUserRole,
          getIssueStatuses,
          updateIssueStatus,
        }}
        projectId={projectId}
        statusId={statusId}
      />
    )
  }
  return { Component }
}
