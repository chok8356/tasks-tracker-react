import type { CreateIssueTypeUseCase } from '@/domain/use-cases/issue-types/create-issue-type'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const createIssueTypeUseCase: CreateIssueTypeUseCase = async (req) => {
  const dto = await fakeFetch.issueTypes.create({
    color: req.color,
    icon: req.icon,
    name: req.name,
    project_id: req.projectId,
  })
  return mapIssueTypeDtoToDomain(dto)
}
