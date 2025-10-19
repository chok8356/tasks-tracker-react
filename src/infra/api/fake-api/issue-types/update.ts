import type { IssueTypeDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueTypesUpdateRequest = Partial<
  Omit<
    IssueTypeDTO,
    'created_at' | 'id' | 'order' | 'project_id' | 'updated_at'
  >
> &
  Pick<IssueTypeDTO, 'id'>
export type IssueTypesUpdateResponse = IssueTypeDTO

export const update = async (
  req: IssueTypesUpdateRequest,
): Promise<IssueTypesUpdateResponse> => {
  const db = await dbPromise

  const issueType = await db.get('project_types', req.id)
  if (!issueType) {
    throw new Error('Issue type not found')
  }

  await checkProjectAdmin(issueType.project_id)
  await fakeApiDelay()

  const tx = db.transaction('project_types', 'readwrite')

  const updatedIssueType: IssueTypeDTO = {
    ...issueType,
    updated_at: new Date().toISOString(),
  }

  if (req.name !== undefined) updatedIssueType.name = req.name
  if (req.icon !== undefined) updatedIssueType.icon = req.icon
  if (req.color !== undefined) updatedIssueType.color = req.color

  await tx.store.put(updatedIssueType)

  await tx.done

  return updatedIssueType
}
