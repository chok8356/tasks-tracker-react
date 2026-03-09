import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { createIssue } from '@/infra/issues/create-issue'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { CreateIssuePage } from '@/ui/pages/app/project-details/children/create-issue/create-issue-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const createIssueLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_ISSUES_CREATE)
    return (
      <CreateIssuePage
        projectId={projectId}
        useCases={{
          createIssue,
          getCurrentUserRole,
          getIssueTypes,
        }}
      />
    )
  }
  return { Component }
}
