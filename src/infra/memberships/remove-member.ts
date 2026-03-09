import type { RemoveMember } from '@/features/memberships/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const removeMember: RemoveMember = async (input) => {
  try {
    await fakeFetch.memberships.remove({ user_id: input.userId })
    return ok(undefined)
  } catch (error) {
    return err(toInfraError(error))
  }
}
