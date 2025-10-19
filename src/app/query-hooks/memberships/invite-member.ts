import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { InviteMemberUseCase } from '@/domain/use-cases/memberships/invite-member'

import { membershipKeys } from './keys.ts'

export const useInviteMemberMutation = (
  projectId: Project['id'],
  inviteMember: InviteMemberUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: membershipKeys.list(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: membershipKeys.currentUserRole(projectId),
        }),
      ])
    },
  })
}
