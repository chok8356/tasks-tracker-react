import type { GetBacklogIssuesUseCase } from '@/domain/use-cases/issues/get-backlog-issues'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getBacklogIssuesUseCase: GetBacklogIssuesUseCase = async (
  projectId,
) => {
  const dtos = await fakeFetch.issues.getBacklog({ project_id: projectId })
  return dtos.map(mapIssueDtoToDomain)
}
