import type { UpdateIssueUseCase } from '@/domain/use-cases/issues/update-issue'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateIssueUseCase: UpdateIssueUseCase = async (req) => {
  const dto = await fakeFetch.issues.update({
    assignee_id: req.assigneeId,
    description: req.description,
    estimate: req.estimate,
    id: req.id,
    reporter_id: req.reporterId,
    status_id: req.statusId,
    summary: req.summary,
    type_id: req.typeId,
  })
  return mapIssueDtoToDomain(dto)
}
