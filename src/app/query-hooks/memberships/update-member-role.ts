import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateMemberRoleUseCase } from '@/domain/use-cases/memberships/update-member-role'

import { membershipKeys } from './keys.ts'

export const useUpdateMemberRoleMutation = (
  projectId: Project['id'],
  updateMemberRole: UpdateMemberRoleUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMemberRole,
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
