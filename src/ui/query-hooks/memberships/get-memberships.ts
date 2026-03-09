import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetMemberships } from '@/features/memberships/actions.ts'

import { membershipKeys } from './keys.ts'

export const useMembershipsQuery = (
  projectId: Project['id'],
  getMemberships: GetMemberships,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getMemberships(projectId),
    queryKey: membershipKeys.list(projectId),
  })
}
