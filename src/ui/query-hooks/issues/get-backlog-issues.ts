import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetBacklogIssues } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useBacklogIssuesQuery = (
  projectId: Project['id'],
  getBacklogIssues: GetBacklogIssues,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getBacklogIssues(projectId),
    queryKey: issueKeys.backlog(projectId),
  })
}
