import type { GetIssue } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getIssue: GetIssue = async (id) => {
  try {
    const dto = await fakeFetch.issues.getById({ id })
    return ok(mapIssueDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
