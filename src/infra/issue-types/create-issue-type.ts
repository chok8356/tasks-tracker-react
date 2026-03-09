import type { CreateIssueType } from '@/features/issue-types/actions.ts'

import { mapIssueTypeDtoToDomain } from '@/infra/acl/issue-type-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const createIssueType: CreateIssueType = async (input) => {
  try {
    const dto = await fakeFetch.issueTypes.create({
      color: input.color,
      icon: input.icon,
      name: input.name,
      project_id: input.projectId,
    })
    return ok(mapIssueTypeDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
