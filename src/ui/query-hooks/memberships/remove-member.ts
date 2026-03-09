import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { RemoveMember } from '@/features/memberships/actions.ts'

import { membershipKeys } from './keys.ts'

export const useRemoveMemberMutation = (
  projectId: Project['id'],
  removeMember: RemoveMember,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeMember,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: membershipKeys.list(projectId),
        })
      }
    },
  })
}
