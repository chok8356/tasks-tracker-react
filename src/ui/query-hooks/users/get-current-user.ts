import { useQuery } from '@tanstack/react-query'

import type { GetCurrentUser } from '@/features/users/actions.ts'

import { userKeys } from './keys.ts'

export const useCurrentUserQuery = (getCurrentUser: GetCurrentUser) => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: userKeys.current(),
  })
}

export const useUserQuery = useCurrentUserQuery
