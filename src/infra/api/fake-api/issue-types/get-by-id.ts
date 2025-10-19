import type { IssueTypeDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueTypesGetByIdRequest = Pick<IssueTypeDTO, 'id'>
export type IssueTypesGetByIdResponse = IssueTypeDTO

export const getById = async (
  req: IssueTypesGetByIdRequest,
): Promise<IssueTypesGetByIdResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issueType = await db.get('project_types', req.id)
  if (!issueType) {
    throw new Error('Issue type not found')
  }

  await checkProjectMembership(issueType.project_id)

  return issueType
}
