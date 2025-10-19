import type { UpdateIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/update-issue-status'

import { mapIssueStatusDtoToDomain } from '@/infra/acl/issue-status-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateIssueStatusUseCase: UpdateIssueStatusUseCase = async (
  req,
) => {
  const dto = await fakeFetch.issueStatuses.update({
    category: req.category,
    id: req.id,
    name: req.name,
    order: req.order,
  })
  return mapIssueStatusDtoToDomain(dto)
}
