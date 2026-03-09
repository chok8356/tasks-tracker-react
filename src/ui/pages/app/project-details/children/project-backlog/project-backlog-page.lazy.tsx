import { getIssueStatuses } from '@/infra/issue-statuses/get-issue-statuses'
import { getIssueTypes } from '@/infra/issue-types/get-issue-types'
import { bulkUpdateIssues } from '@/infra/issues/bulk-update-issues'
import { deleteIssue } from '@/infra/issues/delete-issue'
import { getBacklogIssues } from '@/infra/issues/get-backlog-issues'
import { getBoardIssues } from '@/infra/issues/get-board-issues'
import { moveToBacklog } from '@/infra/issues/move-to-backlog'
import { moveToBoard } from '@/infra/issues/move-to-board'
import { getMemberships } from '@/infra/memberships/get-memberships'
import { ProjectBacklogPage } from '@/ui/pages/app/project-details/children/project-backlog/project-backlog-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectBacklogLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_BACKLOG)
    return (
      <ProjectBacklogPage
        projectId={projectId}
        useCases={{
          bulkUpdateIssues,
          deleteIssue,
          getBacklogIssues,
          getBoardIssues,
          getIssueStatuses,
          getIssueTypes,
          getMemberships,
          moveToBacklog,
          moveToBoard,
        }}
      />
    )
  }
  return { Component }
}
