import type { BulkUpdateIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/bulk-update-issue-statuses'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const bulkUpdateIssueStatusesUseCase: BulkUpdateIssueStatusesUseCase =
  async (req) => {
    const dtos = await fakeFetch.issueStatuses.bulkUpdate({
      project_id: req.projectId,
      updates: req.updates,
    })
    return dtos.map(mapIssueStatusDtoToDomain)
  }
