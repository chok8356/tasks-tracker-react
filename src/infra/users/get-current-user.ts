import type { GetCurrentUser } from '@/features/users/actions.ts'

import { mapUserDtoToDomain } from '@/infra/acl/user-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getCurrentUser: GetCurrentUser = async () => {
  try {
    const userDto = await fakeFetch.auth.getCurrentUser()
    return ok(mapUserDtoToDomain(userDto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
