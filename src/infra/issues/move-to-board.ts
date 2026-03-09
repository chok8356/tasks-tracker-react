import type { MoveToBoard } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const moveToBoard: MoveToBoard = async (input) => {
  try {
    const dto = await fakeFetch.issues.moveToBoard({
      id: input.issueId,
      project_id: input.projectId,
    })
    return ok(mapIssueDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
