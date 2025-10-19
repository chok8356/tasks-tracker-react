import type { UpdateIssueTypeUseCase } from '@/domain/use-cases/issue-types/update-issue-type'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateIssueTypeUseCase: UpdateIssueTypeUseCase = async (req) => {
  const dto = await fakeFetch.issueTypes.update(req)
  return mapIssueTypeDtoToDomain(dto)
}
