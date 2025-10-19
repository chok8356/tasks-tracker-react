import { nanoid } from 'nanoid'

import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesCreateRequest = Pick<
  IssueStatusDTO,
  'category' | 'name' | 'project_id'
>
export type IssueStatusesCreateResponse = IssueStatusDTO

export const create = async (
  req: IssueStatusesCreateRequest,
): Promise<IssueStatusesCreateResponse> => {
  await checkProjectAdmin(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const issueStatuses = await db.getAll('project_statuses')
  const projectIssueStatuses = issueStatuses.filter(
    (is) => is.project_id === req.project_id,
  )
  const maxOrder = projectIssueStatuses.reduce(
    (max, is) => Math.max(max, is.order),
    0,
  )

  const newIssueStatus: IssueStatusDTO = {
    category: req.category,
    created_at: new Date().toISOString(),
    id: nanoid(),
    name: req.name,
    order: maxOrder + 1,
    project_id: req.project_id,
    updated_at: new Date().toISOString(),
  }

  await db.add('project_statuses', newIssueStatus)

  return newIssueStatus
}
