import type { DeleteIssueUseCase } from '@/domain/use-cases/issues/delete-issue'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const deleteIssueUseCase: DeleteIssueUseCase = async (issueId) => {
  await fakeFetch.issues.delete({ id: issueId })
}
