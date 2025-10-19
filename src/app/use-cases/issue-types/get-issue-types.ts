import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getIssueTypesUseCase: GetIssueTypesUseCase = async (projectId) => {
  const dtos = await fakeFetch.issueTypes.getAll({ project_id: projectId })
  return dtos.map(mapIssueTypeDtoToDomain)
}
