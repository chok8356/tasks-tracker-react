import type { MoveToBoardUseCase } from '@/domain/use-cases/issues/move-to-board'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const moveToBoardUseCase: MoveToBoardUseCase = async (req) => {
  const dto = await fakeFetch.issues.moveToBoard({
    id: req.issueId,
    project_id: req.projectId,
  })
  return mapIssueDtoToDomain(dto)
}
