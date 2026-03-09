import type { IssueDTO, IssueTypeDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueTypesDeleteRequest = Pick<IssueTypeDTO, 'id'>
export type IssueTypesDeleteResponse = undefined

export const deleteType = async (
  req: IssueTypesDeleteRequest,
): Promise<IssueTypesDeleteResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issueType = await db.get('project_types', req.id)
  if (!issueType) {
    throw new Error('Issue type not found')
  }

  await checkProjectAdmin(issueType.project_id)

  const issues = await db.getAll('issues')
  const issuesWithThisType = issues.filter(
    (issue) =>
      issue.type_id === req.id && issue.project_id === issueType.project_id,
  )

  if (issuesWithThisType.length > 0) {
    throw new Error(
      'Cannot delete this issue type because there are existing issues with this type.',
    )
  }

  await db.delete('project_types', req.id)

  const remainingIssueTypes = await db.getAll('project_types')
  const remainingProjectIssueTypes = remainingIssueTypes.filter(
    (it) => it.project_id === issueType.project_id,
  )
  const firstIssueType = remainingProjectIssueTypes[0]

  if (firstIssueType) {
    for (const issue of issues) {
      if (issue.type_id === req.id) {
        const updatedIssue: IssueDTO = {
          ...issue,
          type_id: firstIssueType.id,
          updated_at: new Date().toISOString(),
        }
        await db.put('issues', updatedIssue)
      }
    }
  }

  return undefined
}
