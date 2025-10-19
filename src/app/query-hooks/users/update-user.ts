import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateUserUseCase } from '@/domain/use-cases/users/update-user'

import { membershipKeys } from '@/app/query-hooks/memberships/keys.ts'

import { userKeys } from './keys.ts'

export const useUpdateUserMutation = (updateUser: UpdateUserUseCase) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.current(), updatedUser)
      return queryClient.invalidateQueries({
        queryKey: membershipKeys.lists(),
      })
    },
  })
}
