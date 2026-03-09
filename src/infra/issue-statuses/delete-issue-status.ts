import type { DeleteIssueStatus } from '@/features/issue-statuses/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const deleteIssueStatus: DeleteIssueStatus = async (statusId) => {
  try {
    await fakeFetch.issueStatuses.delete({ id: statusId })
    return ok(undefined)
  } catch (error) {
    return err(toInfraError(error))
  }
}
