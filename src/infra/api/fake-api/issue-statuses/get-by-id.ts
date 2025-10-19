import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesGetByIdRequest = Pick<IssueStatusDTO, 'id'>
export type IssueStatusesGetByIdResponse = IssueStatusDTO

export const getById = async (
  req: IssueStatusesGetByIdRequest,
): Promise<IssueStatusesGetByIdResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issueStatus = await db.get('project_statuses', req.id)
  if (!issueStatus) {
    throw new Error('Issue status not found')
  }

  await checkProjectMembership(issueStatus.project_id)

  return issueStatus
}
