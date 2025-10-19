import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesBulkUpdateRequest = {
  project_id: string
  updates: Partial<Pick<IssueStatusDTO, 'id' | 'name' | 'order'>>[]
}
export type IssueStatusesBulkUpdateResponse = IssueStatusDTO[]

export const bulkUpdate = async (
  req: IssueStatusesBulkUpdateRequest,
): Promise<IssueStatusesBulkUpdateResponse> => {
  await checkProjectAdmin(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const tx = db.transaction('project_statuses', 'readwrite')
  const now = new Date().toISOString()
  const updatedStatuses: IssueStatusDTO[] = []

  for (const update of req.updates) {
    if (!update.id) {
      console.warn(`Update object is missing an ID, skipping.`)
      continue
    }

    const status = await tx.store.get(update.id)

    if (!status || status.project_id !== req.project_id) {
      console.warn(
        `Issue status ${update.id} not found or not in project ${req.project_id}`,
      )
      continue
    }

    const next: IssueStatusDTO = { ...status, updated_at: now }

    if (update.name !== undefined) next.name = update.name
    if (update.order !== undefined) next.order = update.order

    await tx.store.put(next)
    updatedStatuses.push(next)
  }

  await tx.done
  updatedStatuses.sort((a, b) => a.order - b.order)

  return updatedStatuses
}
