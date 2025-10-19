import type { DeleteIssueTypeUseCase } from '@/domain/use-cases/issue-types/delete-issue-type'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const deleteIssueTypeUseCase: DeleteIssueTypeUseCase = async (
  typeId,
) => {
  await fakeFetch.issueTypes.delete({ id: typeId })
}
