import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { InviteMember } from '@/features/memberships/actions.ts'

import { membershipKeys } from './keys.ts'

export const useInviteMemberMutation = (
  projectId: Project['id'],
  inviteMember: InviteMember,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: membershipKeys.list(projectId),
        })
      }
    },
  })
}
