import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetIssueStatuses } from '@/features/issue-statuses/actions.ts'

import { issueStatusKeys } from './keys.ts'

export const useIssueStatusesQuery = (
  projectId: Project['id'],
  getIssueStatuses: GetIssueStatuses,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getIssueStatuses(projectId),
    queryKey: issueStatusKeys.list(projectId),
  })
}
