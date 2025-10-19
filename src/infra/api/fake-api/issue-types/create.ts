import { nanoid } from 'nanoid'

import type { IssueTypeDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueTypesCreateRequest = Pick<
  IssueTypeDTO,
  'color' | 'icon' | 'name' | 'project_id'
>
export type IssueTypesCreateResponse = IssueTypeDTO

export const create = async (
  req: IssueTypesCreateRequest,
): Promise<IssueTypesCreateResponse> => {
  await checkProjectAdmin(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const issueTypes = await db.getAll('project_types')
  const projectIssueTypes = issueTypes.filter(
    (it) => it.project_id === req.project_id,
  )
  const maxOrder = projectIssueTypes.reduce(
    (max, it) => Math.max(max, it.order),
    0,
  )

  const newIssueType: IssueTypeDTO = {
    color: req.color,
    created_at: new Date().toISOString(),
    icon: req.icon,
    id: nanoid(),
    name: req.name,
    order: maxOrder + 1,
    project_id: req.project_id,
    updated_at: new Date().toISOString(),
  }

  await db.add('project_types', newIssueType)

  return newIssueType
}
