import type { IssueTypeDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueTypesGetAllRequest = Pick<IssueTypeDTO, 'project_id'>
export type IssueTypesGetAllResponse = IssueTypeDTO[]

export const getAll = async (
  req: IssueTypesGetAllRequest,
): Promise<IssueTypesGetAllResponse> => {
  await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const issueTypes = await db.getAll('project_types')
  const projectIssueTypes = issueTypes
    .filter((it) => it.project_id === req.project_id)
    .sort((a, b) => a.name.localeCompare(b.name))

  return projectIssueTypes
}
