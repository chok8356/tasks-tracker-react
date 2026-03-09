import type { GetIssueStatuses } from '@/features/issue-statuses/actions.ts'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getIssueStatuses: GetIssueStatuses = async (projectId) => {
  try {
    const dtos = await fakeFetch.issueStatuses.getAll({
      project_id: projectId,
    })
    return ok(dtos.map(mapIssueStatusDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
