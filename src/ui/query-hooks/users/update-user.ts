import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateUser } from '@/features/users/actions.ts'

import { userKeys } from './keys.ts'

export const useUpdateUserMutation = (updateUser: UpdateUser) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({ queryKey: userKeys.current() })
      }
    },
  })
}
