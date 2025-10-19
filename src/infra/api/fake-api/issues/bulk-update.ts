import type { IssueDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssuesBulkUpdateRequest = {
  project_id: string
  updates: Partial<
    Pick<IssueDTO, 'id' | 'is_on_board' | 'order' | 'status_id'>
  >[]
}
export type IssuesBulkUpdateResponse = IssueDTO[]

export const bulkUpdate = async (
  req: IssuesBulkUpdateRequest,
): Promise<IssuesBulkUpdateResponse> => {
  await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const tx = db.transaction('issues', 'readwrite')
  const now = new Date().toISOString()
  const updatedIssues: IssueDTO[] = []

  for (const update of req.updates) {
    if (!update.id) {
      console.warn(`Update object is missing an ID, skipping.`)
      continue
    }

    const issue = await tx.store.get(update.id)

    if (!issue || issue.project_id !== req.project_id) {
      console.warn(
        `Issue ${update.id} not found or not in project ${req.project_id}`,
      )
      continue
    }

    const next: IssueDTO = { ...issue, updated_at: now }

    if (update.is_on_board !== undefined) next.is_on_board = update.is_on_board
    if (update.order !== undefined) next.order = update.order
    if (update.status_id !== undefined) next.status_id = update.status_id

    await tx.store.put(next)
    updatedIssues.push(next)
  }

  await tx.done
  updatedIssues.sort((a, b) => a.order - b.order)

  return updatedIssues
}
