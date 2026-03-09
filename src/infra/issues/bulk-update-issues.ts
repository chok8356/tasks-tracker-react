import type { BulkUpdateIssues } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const bulkUpdateIssues: BulkUpdateIssues = async (input) => {
  try {
    const dtos = await fakeFetch.issues.bulkUpdate({
      project_id: input.projectId,
      updates: input.updates.map((u) => ({
        id: u.id,
        order: u.order,
        status_id: u.statusId,
      })),
    })
    return ok(dtos.map(mapIssueDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
