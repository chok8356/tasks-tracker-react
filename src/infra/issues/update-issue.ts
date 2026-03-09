import type { UpdateIssue } from '@/features/issues/actions.ts'

import { mapIssueDtoToDomain } from '@/infra/acl/issue-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateIssue: UpdateIssue = async (input) => {
  try {
    const dto = await fakeFetch.issues.update({
      assignee_id: input.assigneeId,
      description: input.description,
      estimate: input.estimate,
      id: input.id,
      reporter_id: input.reporterId,
      status_id: input.statusId,
      summary: input.summary,
      type_id: input.typeId,
    })
    return ok(mapIssueDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
