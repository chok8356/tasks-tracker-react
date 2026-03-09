import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesDeleteRequest = Pick<IssueDTO, 'id'>
export type IssuesDeleteResponse = undefined

export const deleteIssue = async (
  req: IssuesDeleteRequest,
): Promise<IssuesDeleteResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issue = await db.get('issues', req.id)
  if (!issue) {
    throw new Error('Issue not found')
  }

  await checkProjectMembership(issue.project_id)

  await db.delete('issues', req.id)

  return undefined
}
