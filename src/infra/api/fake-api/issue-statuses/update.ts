import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesUpdateRequest = Partial<
  Omit<IssueStatusDTO, 'created_at' | 'id' | 'project_id' | 'updated_at'>
> &
  Pick<IssueStatusDTO, 'id'>
export type IssueStatusesUpdateResponse = IssueStatusDTO

export const update = async (
  req: IssueStatusesUpdateRequest,
): Promise<IssueStatusesUpdateResponse> => {
  const db = await dbPromise

  const issueStatus = await db.get('project_statuses', req.id)
  if (!issueStatus) {
    throw new Error('Issue status not found')
  }

  await checkProjectAdmin(issueStatus.project_id)
  await fakeApiDelay()

  const tx = db.transaction('project_statuses', 'readwrite')

  const updatedIssueStatus: IssueStatusDTO = {
    ...issueStatus,
    updated_at: new Date().toISOString(),
  }

  if (req.name !== undefined) updatedIssueStatus.name = req.name
  if (req.order !== undefined) updatedIssueStatus.order = req.order
  if (req.category !== undefined) updatedIssueStatus.category = req.category

  await tx.store.put(updatedIssueStatus)

  await tx.done

  return updatedIssueStatus
}
