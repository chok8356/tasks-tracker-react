import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesGetAllRequest = Pick<IssueStatusDTO, 'project_id'>
export type IssueStatusesGetAllResponse = IssueStatusDTO[]

export const getAll = async (
  req: IssueStatusesGetAllRequest,
): Promise<IssueStatusesGetAllResponse> => {
  await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const issueStatuses = await db.getAll('project_statuses')
  const projectIssueStatuses = issueStatuses
    .filter((is) => is.project_id === req.project_id)
    .sort((a, b) => a.order - b.order)

  return projectIssueStatuses
}
