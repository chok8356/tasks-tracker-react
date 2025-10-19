import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesMoveToBacklogRequest = Pick<IssueDTO, 'id' | 'project_id'>
export type IssuesMoveToBacklogResponse = IssueDTO

export const moveToBacklog = async (
  req: IssuesMoveToBacklogRequest,
): Promise<IssuesMoveToBacklogResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issueToMove = await db.get('issues', req.id)
  if (!issueToMove) {
    throw new Error('Issue not found')
  }

  if (issueToMove.project_id !== req.project_id) {
    throw new Error('Issue does not belong to this project')
  }

  await checkProjectMembership(issueToMove.project_id)

  const allIssues = await db.getAll('issues')
  const backlogIssues = allIssues.filter(
    (i) => i.project_id === req.project_id && !i.is_on_board && i.id !== req.id,
  )

  backlogIssues.sort((a, b) => a.order - b.order)

  const tx = db.transaction('issues', 'readwrite')
  const now = new Date().toISOString()

  for (let i = 0; i < backlogIssues.length; i++) {
    const issue = backlogIssues[i]
    issue.order = i + 1
    issue.updated_at = now
    await tx.store.put(issue)
  }

  issueToMove.is_on_board = false
  issueToMove.order = 0
  issueToMove.updated_at = now
  await tx.store.put(issueToMove)

  await tx.done

  return issueToMove
}
