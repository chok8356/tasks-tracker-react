import type { DeleteIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/delete-issue-status'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const deleteIssueStatusUseCase: DeleteIssueStatusUseCase = async (
  statusId,
) => {
  await fakeFetch.issueStatuses.delete({ id: statusId })
}
