import type { GetBoardIssuesUseCase } from '@/domain/use-cases/issues/get-board-issues'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getBoardIssuesUseCase: GetBoardIssuesUseCase = async (
  projectId,
) => {
  const dtos = await fakeFetch.issues.getBoard({ project_id: projectId })
  return dtos.map(mapIssueDtoToDomain)
}
