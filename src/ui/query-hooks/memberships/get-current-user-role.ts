import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetCurrentUserRole } from '@/features/memberships/actions.ts'

import { membershipKeys } from './keys.ts'

export const useCurrentUserRoleQuery = (
  projectId: Project['id'],
  getCurrentUserRole: GetCurrentUserRole,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getCurrentUserRole(projectId),
    queryKey: membershipKeys.currentUserRole(projectId),
  })
}
