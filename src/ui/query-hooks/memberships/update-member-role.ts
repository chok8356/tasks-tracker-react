import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateMemberRole } from '@/features/memberships/actions.ts'

import { membershipKeys } from './keys.ts'

export const useUpdateMemberRoleMutation = (
  projectId: Project['id'],
  updateMemberRole: UpdateMemberRole,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMemberRole,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: membershipKeys.list(projectId),
        })
      }
    },
  })
}
