import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getIssueStatusesUseCase: GetIssueStatusesUseCase = async (
  projectId,
) => {
  const dtos = await fakeFetch.issueStatuses.getAll({
    project_id: projectId,
  })
  return dtos.map(mapIssueStatusDtoToDomain)
}
