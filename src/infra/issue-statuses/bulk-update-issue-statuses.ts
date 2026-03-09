import type { BulkUpdateIssueStatuses } from '@/features/issue-statuses/actions.ts'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const bulkUpdateIssueStatuses: BulkUpdateIssueStatuses = async (
  input,
) => {
  try {
    const dtos = await fakeFetch.issueStatuses.bulkUpdate({
      project_id: input.projectId,
      updates: input.updates,
    })
    return ok(dtos.map(mapIssueStatusDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
