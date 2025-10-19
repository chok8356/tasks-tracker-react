import { getIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/get-issue-statuses'
import { updateIssueStatusUseCase } from '@/app/use-cases/issue-statuses/update-issue-status'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { EditIssueStatusPage } from '@/ui/pages/app/project-details/children/project-settings/children/edit-issue-status/edit-issue-status-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const editIssueStatusLazyLoader = async () => {
  function Component() {
    const { projectId, statusId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_EDIT,
    )
    return (
      <EditIssueStatusPage
        projectId={projectId}
        statusId={statusId}
        useCases={{
          getCurrentUserRoleUseCase,
          getIssueStatusesUseCase,
          updateIssueStatusUseCase,
        }}
      />
    )
  }
  return { Component }
}
