import type { CreateIssueUseCase } from '@/domain/use-cases/issues/create-issue'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const createIssueUseCase: CreateIssueUseCase = async (req) => {
  const dto = await fakeFetch.issues.create({
    description: req.description,
    project_id: req.projectId,
    summary: req.summary,
    type_id: req.typeId,
  })
  return mapIssueDtoToDomain(dto)
}
