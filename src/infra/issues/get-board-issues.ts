import type { GetBoardIssues } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getBoardIssues: GetBoardIssues = async (projectId) => {
  try {
    const dtos = await fakeFetch.issues.getBoard({ project_id: projectId })
    return ok(dtos.map(mapIssueDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
