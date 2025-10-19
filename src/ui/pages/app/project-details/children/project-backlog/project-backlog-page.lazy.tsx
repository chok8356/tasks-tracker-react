import { getIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/get-issue-statuses'
import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { bulkUpdateIssuesUseCase } from '@/app/use-cases/issues/bulk-update-issues'
import { deleteIssueUseCase } from '@/app/use-cases/issues/delete-issue'
import { getBacklogIssuesUseCase } from '@/app/use-cases/issues/get-backlog-issues'
import { getBoardIssuesUseCase } from '@/app/use-cases/issues/get-board-issues'
import { moveToBacklogUseCase } from '@/app/use-cases/issues/move-to-backlog'
import { moveToBoardUseCase } from '@/app/use-cases/issues/move-to-board'
import { getMembershipsUseCase } from '@/app/use-cases/memberships/get-memberships'
import { ProjectBacklogPage } from '@/ui/pages/app/project-details/children/project-backlog/project-backlog-page'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectBacklogLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT_BACKLOG)
    return (
      <ProjectBacklogPage
        projectId={projectId}
        useCases={{
          bulkUpdateIssuesUseCase,
          deleteIssueUseCase,
          getBacklogIssuesUseCase,
          getBoardIssuesUseCase,
          getIssueStatusesUseCase,
          getIssueTypesUseCase,
          getMembershipsUseCase,
          moveToBacklogUseCase,
          moveToBoardUseCase,
        }}
      />
    )
  }
  return { Component }
}
