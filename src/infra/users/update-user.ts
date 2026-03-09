import type { UpdateUser } from '@/features/users/actions.ts'

import { mapUserDtoToDomain } from '@/infra/acl/user-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateUser: UpdateUser = async (input) => {
  try {
    const userDto = await fakeFetch.auth.updateCurrentUser(input)
    return ok(mapUserDtoToDomain(userDto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
