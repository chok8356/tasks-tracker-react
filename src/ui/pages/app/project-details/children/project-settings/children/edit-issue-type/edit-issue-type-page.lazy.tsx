import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { updateIssueTypeUseCase } from '@/app/use-cases/issue-types/update-issue-type'
import { getCurrentUserRoleUseCase } from '@/app/use-cases/memberships/get-current-user-role'
import { EditIssueTypePage } from '@/ui/pages/app/project-details/children/project-settings/children/edit-issue-type/edit-issue-type-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const editIssueTypeLazyLoader = async () => {
  function Component() {
    const { projectId, typeId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_EDIT,
    )
    return (
      <EditIssueTypePage
        projectId={projectId}
        typeId={typeId}
        useCases={{
          getCurrentUserRoleUseCase,
          getIssueTypesUseCase,
          updateIssueTypeUseCase,
        }}
      />
    )
  }
  return { Component }
}
