import type { CreateIssue } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const createIssue: CreateIssue = async (input) => {
  try {
    const dto = await fakeFetch.issues.create({
      description: input.description,
      project_id: input.projectId,
      summary: input.summary,
      type_id: input.typeId,
    })
    return ok(mapIssueDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
