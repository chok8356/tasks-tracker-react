import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'

import { issueStatusKeys } from './keys.ts'

export const useIssueStatusesQuery = (
  projectId: Project['id'],
  getIssueStatuses: GetIssueStatusesUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getIssueStatuses(projectId),
    queryKey: issueStatusKeys.list(projectId),
  })
}
