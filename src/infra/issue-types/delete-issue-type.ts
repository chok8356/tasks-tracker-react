import type { DeleteIssueType } from '@/features/issue-types/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const deleteIssueType: DeleteIssueType = async (typeId) => {
  try {
    await fakeFetch.issueTypes.delete({ id: typeId })
    return ok(undefined)
  } catch (error) {
    return err(toInfraError(error))
  }
}
