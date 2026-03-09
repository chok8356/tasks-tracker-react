import type { GetBacklogIssues } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getBacklogIssues: GetBacklogIssues = async (projectId) => {
  try {
    const dtos = await fakeFetch.issues.getBacklog({ project_id: projectId })
    return ok(dtos.map(mapIssueDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
