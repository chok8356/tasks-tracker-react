import { bulkUpdateIssueStatuses } from '@/infra/issue-statuses/bulk-update-issue-statuses'
import { deleteIssueStatus } from '@/infra/issue-statuses/delete-issue-status'
import { getIssueStatuses } from '@/infra/issue-statuses/get-issue-statuses'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { IssueStatusesPage } from '@/ui/pages/app/project-details/children/project-settings/children/issue-statuses/issue-statuses-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const issueStatusesLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES)
    return (
      <IssueStatusesPage
        deps={{
          bulkUpdateIssueStatuses,
          deleteIssueStatus,
          getCurrentUserRole,
          getIssueStatuses,
        }}
        projectId={projectId}
      />
    )
  }
  return { Component }
}
