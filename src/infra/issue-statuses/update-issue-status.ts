import type { UpdateIssueStatus } from '@/features/issue-statuses/actions.ts'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateIssueStatus: UpdateIssueStatus = async (input) => {
  try {
    const dto = await fakeFetch.issueStatuses.update({
      category: input.category,
      id: input.id,
      name: input.name,
      order: input.order,
    })
    return ok(mapIssueStatusDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
