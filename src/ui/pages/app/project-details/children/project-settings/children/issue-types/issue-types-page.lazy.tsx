import { deleteIssueTypeUseCase } from '@/app/use-cases/issue-types/delete-issue-type'
import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { IssueTypesPage } from '@/ui/pages/app/project-details/children/project-settings/children/issue-types/issue-types-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const issueTypesLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES)
    return (
      <IssueTypesPage
        projectId={projectId}
        useCases={{
          deleteIssueTypeUseCase,
          getCurrentUserRoleUseCase,
          getIssueTypesUseCase,
        }}
      />
    )
  }
  return { Component }
}
