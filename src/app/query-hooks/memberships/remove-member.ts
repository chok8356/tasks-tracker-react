import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { RemoveMemberUseCase } from '@/domain/use-cases/memberships/remove-member'

import { membershipKeys } from './keys.ts'

export const useRemoveMemberMutation = (
  projectId: Project['id'],
  removeMember: RemoveMemberUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: membershipKeys.list(projectId),
        }),
      ])
    },
  })
}
