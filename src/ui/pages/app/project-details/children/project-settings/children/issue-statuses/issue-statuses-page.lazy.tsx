import { bulkUpdateIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/bulk-update-issue-statuses'
import { deleteIssueStatusUseCase } from '@/app/use-cases/issue-statuses/delete-issue-status'
import { getIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/get-issue-statuses'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { IssueStatusesPage } from '@/ui/pages/app/project-details/children/project-settings/children/issue-statuses/issue-statuses-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const issueStatusesLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES)
    return (
      <IssueStatusesPage
        projectId={projectId}
        useCases={{
          bulkUpdateIssueStatusesUseCase,
          deleteIssueStatusUseCase,
          getCurrentUserRoleUseCase,
          getIssueStatusesUseCase,
        }}
      />
    )
  }
  return { Component }
}
