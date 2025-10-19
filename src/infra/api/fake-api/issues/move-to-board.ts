import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesMoveToBoardRequest = Pick<IssueDTO, 'id' | 'project_id'>
export type IssuesMoveToBoardResponse = IssueDTO

export const moveToBoard = async (
  req: IssuesMoveToBoardRequest,
): Promise<IssuesMoveToBoardResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issue = await db.get('issues', req.id)
  if (!issue) {
    throw new Error('Issue not found')
  }

  if (issue.project_id !== req.project_id) {
    throw new Error('Issue does not belong to this project')
  }

  await checkProjectMembership(issue.project_id)

  const allIssues = await db.getAll('issues')
  const boardIssues = allIssues.filter(
    (i) => i.project_id === req.project_id && i.is_on_board,
  )

  const maxOrder = boardIssues.reduce((max, i) => Math.max(max, i.order), -1)
  const sortOrder = maxOrder + 1

  const updatedIssue: IssueDTO = {
    ...issue,
    is_on_board: true,
    order: sortOrder,
    updated_at: new Date().toISOString(),
  }

  await db.put('issues', updatedIssue)

  return updatedIssue
}
