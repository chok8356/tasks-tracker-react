import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetMembershipsUseCase } from '@/domain/use-cases/memberships/get-memberships'

import { membershipKeys } from './keys.ts'

export const useMembershipsQuery = (
  projectId: Project['id'],
  getMemberships: GetMembershipsUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getMemberships(projectId),
    queryKey: membershipKeys.list(projectId),
  })
}
