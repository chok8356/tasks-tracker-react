import type { GetIssueUseCase } from '@/domain/use-cases/issues/get-issue'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getIssueUseCase: GetIssueUseCase = async (id) => {
  const dto = await fakeFetch.issues.getById({ id })
  return mapIssueDtoToDomain(dto)
}
