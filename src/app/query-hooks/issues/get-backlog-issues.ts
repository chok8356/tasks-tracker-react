import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetBacklogIssuesUseCase } from '@/domain/use-cases/issues/get-backlog-issues'

import { issueKeys } from './keys.ts'

export const useBacklogIssuesQuery = (
  projectId: Project['id'],
  getBacklogIssues: GetBacklogIssuesUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getBacklogIssues(projectId),
    queryKey: issueKeys.backlog(projectId),
  })
}
