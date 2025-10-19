import { useQuery } from '@tanstack/react-query'

import type { GetCurrentUserUseCase } from '@/domain/use-cases/users/get-current-user'

import { userKeys } from './keys.ts'

export const useUserQuery = (getCurrentUser: GetCurrentUserUseCase) => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: userKeys.current(),
  })
}
