import type { CreateIssueStatus } from '@/features/issue-statuses/actions.ts'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const createIssueStatus: CreateIssueStatus = async (input) => {
  try {
    const dto = await fakeFetch.issueStatuses.create({
      category: input.category,
      name: input.name,
      project_id: input.projectId,
    })
    return ok(mapIssueStatusDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
