import type { GetIssueTypes } from '@/features/issue-types/actions.ts'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getIssueTypes: GetIssueTypes = async (projectId) => {
  try {
    const dtos = await fakeFetch.issueTypes.getAll({ project_id: projectId })
    return ok(dtos.map(mapIssueTypeDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
