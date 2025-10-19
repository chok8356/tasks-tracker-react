import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { createIssueUseCase } from '@/app/use-cases/issues/create-issue'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { CreateIssuePage } from '@/ui/pages/app/project-details/children/create-issue/create-issue-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createIssueLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_ISSUES_CREATE)
    return (
      <CreateIssuePage
        projectId={projectId}
        useCases={{
          createIssueUseCase,
          getCurrentUserRoleUseCase,
          getIssueTypesUseCase,
        }}
      />
    )
  }
  return { Component }
}
