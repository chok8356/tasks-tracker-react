import type { BulkUpdateIssuesUseCase } from '@/domain/use-cases/issues/bulk-update-issues'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const bulkUpdateIssuesUseCase: BulkUpdateIssuesUseCase = async (req) => {
  const dtos = await fakeFetch.issues.bulkUpdate({
    project_id: req.projectId,
    updates: req.updates.map((u) => ({
      id: u.id,
      order: u.order,
      status_id: u.statusId,
    })),
  })
  return dtos.map(mapIssueDtoToDomain)
}
