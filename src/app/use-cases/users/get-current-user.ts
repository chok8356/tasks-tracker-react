import type { GetCurrentUserUseCase } from '@/domain/use-cases/users/get-current-user'

import { mapUserDtoToDomain } from '@/infra/acl/user-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getCurrentUserUseCase: GetCurrentUserUseCase = async () => {
  const userDto = await fakeFetch.auth.getCurrentUser()
  return mapUserDtoToDomain(userDto)
}
