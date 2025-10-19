import { getIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/get-issue-statuses'
import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { getIssueUseCase } from '@/app/use-cases/issues/get-issue'
import { updateIssueUseCase } from '@/app/use-cases/issues/update-issue'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { getMembershipsUseCase } from '@/app/use-cases/memberships/get-memberships'
import { IssueDetailsPage } from '@/ui/pages/app/project-details/children/issue-details/issue-details-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const issueDetailsLazyLoader = async () => {
  function Component() {
    const { issueId, projectId } = useParamsFor(ROUTES.PROJECT_ISSUES_ISSUE)
    return (
      <IssueDetailsPage
        issueId={issueId}
        projectId={projectId}
        useCases={{
          getCurrentUserRoleUseCase,
          getIssueStatusesUseCase,
          getIssueTypesUseCase,
          getIssueUseCase,
          getMembershipsUseCase,
          updateIssueUseCase,
        }}
      />
    )
  }
  return { Component }
}
