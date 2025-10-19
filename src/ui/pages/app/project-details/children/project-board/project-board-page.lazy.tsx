import { getIssueStatusesUseCase } from '@/app/use-cases/issue-statuses/get-issue-statuses'
import { getIssueTypesUseCase } from '@/app/use-cases/issue-types/get-issue-types'
import { bulkUpdateIssuesUseCase } from '@/app/use-cases/issues/bulk-update-issues'
import { getBoardIssuesUseCase } from '@/app/use-cases/issues/get-board-issues'
import { getMembershipsUseCase } from '@/app/use-cases/memberships/get-memberships'
import { ProjectBoardPage } from '@/ui/pages/app/project-details/children/project-board/project-board-page.tsx'
import { ROUTES, useParamsFor } from '@/ui/router/routes'

export const projectBoardLazyLoader = async () => {
  function Component() {
    const { projectId } = useParamsFor(ROUTES.PROJECT)
    return (
      <ProjectBoardPage
        projectId={projectId}
        useCases={{
          bulkUpdateIssuesUseCase,
          getBoardIssuesUseCase,
          getIssueStatusesUseCase,
          getIssueTypesUseCase,
          getMembershipsUseCase,
        }}
      />
    )
  }
  return { Component }
}
