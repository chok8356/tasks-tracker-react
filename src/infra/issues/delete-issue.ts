import type { DeleteIssue } from '@/features/issues/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const deleteIssue: DeleteIssue = async (issueId) => {
  try {
    await fakeFetch.issues.delete({ id: issueId })
    return ok(undefined)
  } catch (error) {
    return err(toInfraError(error))
  }
}
