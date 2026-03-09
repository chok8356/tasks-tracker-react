import { getIssueStatuses } from '@/infra/issue-statuses/get-issue-statuses'
import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { getIssue } from '@/infra/issues/get-issue'
import { updateIssue } from '@/infra/issues/update-issue'
import { getCurrentUserRole } from '@/infra/memberships/get-current-user-role'
import { getMemberships } from '@/infra/memberships/get-memberships'
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
          getCurrentUserRole,
          getIssue,
          getIssueStatuses,
          getIssueTypes,
          getMemberships,
          updateIssue,
        }}
      />
    )
  }
  return { Component }
}
