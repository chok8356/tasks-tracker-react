import type { UpdateUserUseCase } from '@/domain/use-cases/users/update-user'

import { mapUserDtoToDomain } from '@/infra/acl/user-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateUserUseCase: UpdateUserUseCase = async (req) => {
  const userDto = await fakeFetch.auth.updateCurrentUser(req)
  return mapUserDtoToDomain(userDto)
}
