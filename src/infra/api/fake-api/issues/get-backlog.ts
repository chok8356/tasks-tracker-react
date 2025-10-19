import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesGetBacklogRequest = Pick<IssueDTO, 'project_id'>
export type IssuesGetBacklogResponse = IssueDTO[]

export const getBacklog = async (
  req: IssuesGetBacklogRequest,
): Promise<IssuesGetBacklogResponse> => {
  await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const issues = await db.getAll('issues')
  const projectIssues = issues.filter(
    (i) => i.project_id === req.project_id && !i.is_on_board,
  )

  projectIssues.sort((a, b) => a.order - b.order)

  return projectIssues
}
