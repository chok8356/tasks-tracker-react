import { getIssueStatuses } from '@/infra/issue-statuses/get-issue-statuses'
import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { bulkUpdateIssues } from '@/infra/issues/bulk-update-issues'
import { getBoardIssues } from '@/infra/issues/get-board-issues'
import { getMemberships } from '@/infra/memberships/get-memberships'
import { ProjectBoardPage } from '@/ui/pages/app/project-details/children/project-board/project-board-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectBoardLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectBoardPage
        projectId={projectId}
        useCases={{
          bulkUpdateIssues,
          getBoardIssues,
          getIssueStatuses,
          getIssueTypes,
          getMemberships,
        }}
      />
    )
  }
  return { Component }
}
