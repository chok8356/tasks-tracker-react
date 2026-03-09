import type { UpdateIssueType } from '@/features/issue-types/actions.ts'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateIssueType: UpdateIssueType = async (input) => {
  try {
    const dto = await fakeFetch.issueTypes.update(input)
    return ok(mapIssueTypeDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
