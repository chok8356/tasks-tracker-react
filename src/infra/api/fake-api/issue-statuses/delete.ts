import type { IssueDTO, IssueStatusDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type IssueStatusesDeleteRequest = Pick<IssueStatusDTO, 'id'>
export type IssueStatusesDeleteResponse = void

export const deleteStatus = async (
  req: IssueStatusesDeleteRequest,
): Promise<IssueStatusesDeleteResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const issueStatus = await db.get('project_statuses', req.id)
  if (!issueStatus) {
    throw new Error('Issue status not found')
  }

  await checkProjectAdmin(issueStatus.project_id)

  const issues = await db.getAll('issues')
  const issuesWithThisStatus = issues.filter(
    (issue) =>
      issue.status_id === req.id && issue.project_id === issueStatus.project_id,
  )

  if (issuesWithThisStatus.length > 0) {
    throw new Error(
      'Cannot delete this issue status because there are existing issues with this status.',
    )
  }

  await db.delete('project_statuses', req.id)

  const remainingIssueStatuses = await db.getAll('project_statuses')
  const remainingProjectIssueStatuses = remainingIssueStatuses.filter(
    (is) => is.project_id === issueStatus.project_id,
  )
  const firstIssueStatus = remainingProjectIssueStatuses[0]

  if (firstIssueStatus) {
    for (const issue of issues) {
      if (issue.status_id === req.id) {
        const updatedIssue: IssueDTO = {
          ...issue,
          status_id: firstIssueStatus.id,
          updated_at: new Date().toISOString(),
        }
        await db.put('issues', updatedIssue)
      }
    }
  }
}
