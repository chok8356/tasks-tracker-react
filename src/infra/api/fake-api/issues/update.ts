import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesUpdateRequest = Partial<
  Omit<IssueDTO, 'created_at' | 'id' | 'order' | 'project_id' | 'updated_at'>
> &
  Pick<IssueDTO, 'id'>
export type IssuesUpdateResponse = IssueDTO

export const update = async (
  req: IssuesUpdateRequest,
): Promise<IssuesUpdateResponse> => {
  const db = await dbPromise

  const issue = await db.get('issues', req.id)
  if (!issue) {
    throw new Error('Issue not found')
  }

  await checkProjectMembership(issue.project_id)
  await fakeApiDelay()

  const tx = db.transaction('issues', 'readwrite')

  const updatedIssue: IssueDTO = {
    ...issue,
    updated_at: new Date().toISOString(),
  }

  if (req.summary !== undefined) updatedIssue.summary = req.summary
  if (req.description !== undefined) updatedIssue.description = req.description
  if (req.assignee_id !== undefined) updatedIssue.assignee_id = req.assignee_id
  if (req.reporter_id !== undefined) updatedIssue.reporter_id = req.reporter_id
  if (req.estimate !== undefined) updatedIssue.estimate = req.estimate
  if (req.status_id !== undefined) updatedIssue.status_id = req.status_id
  if (req.type_id !== undefined) updatedIssue.type_id = req.type_id
  if (req.is_on_board !== undefined) updatedIssue.is_on_board = req.is_on_board

  await tx.store.put(updatedIssue)

  await tx.done

  return updatedIssue
}
