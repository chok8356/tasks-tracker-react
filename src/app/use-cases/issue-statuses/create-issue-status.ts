import type { CreateIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/create-issue-status'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const createIssueStatusUseCase: CreateIssueStatusUseCase = async (
  req,
) => {
  const dto = await fakeFetch.issueStatuses.create({
    category: req.category,
    name: req.name,
    project_id: req.projectId,
  })
  return mapIssueStatusDtoToDomain(dto)
}
