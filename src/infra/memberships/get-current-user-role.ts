import type { GetCurrentUserRole } from '@/features/memberships/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getCurrentUserRole: GetCurrentUserRole = async (projectId) => {
  try {
    const role = await fakeFetch.memberships.getCurrentUserRole({
      project_id: projectId,
    })
    return ok(role)
  } catch (error) {
    return err(toInfraError(error))
  }
}
