import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { membershipKeys } from './keys.ts'

export const useCurrentUserRoleQuery = (
  projectId: Project['id'],
  getCurrentUserRole: GetCurrentUserRoleUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getCurrentUserRole(projectId),
    queryKey: membershipKeys.currentUserRole(projectId),
  })
}
