import { createIssueStatusUseCase } from '@/app/use-cases/issue-statuses/create-issue-status'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { CreateIssueStatusPage } from '@/ui/pages/app/project-details/children/project-settings/children/create-issue-status/create-issue-status-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createIssueStatusLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES_CREATE,
    )
    return (
      <CreateIssueStatusPage
        projectId={projectId}
        useCases={{
          createIssueStatusUseCase,
          getCurrentUserRoleUseCase,
        }}
      />
    )
  }
  return { Component }
}
