import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { updateIssueType } from '@/infra/issue-types/update-issue-type'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { EditIssueTypePage } from '@/ui/pages/app/project-details/children/project-settings/children/edit-issue-type/edit-issue-type-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const editIssueTypeLazyLoader = async () => {
  function Component() {
    const { projectId, typeId } = useParamsFor(
      ROUTES.PROJECT_SETTINGS_ISSUE_TYPES_EDIT,
    )
    return (
      <EditIssueTypePage
        deps={{
          getCurrentUserRole,
          getIssueTypes,
          updateIssueType,
        }}
        projectId={projectId}
        typeId={typeId}
      />
    )
  }
  return { Component }
}
