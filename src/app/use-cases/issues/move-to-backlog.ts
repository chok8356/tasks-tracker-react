import type { MoveToBacklogUseCase } from '@/domain/use-cases/issues/move-to-backlog'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const moveToBacklogUseCase: MoveToBacklogUseCase = async (req) => {
  const dto = await fakeFetch.issues.moveToBacklog({
    id: req.issueId,
    project_id: req.projectId,
  })
  return mapIssueDtoToDomain(dto)
}
