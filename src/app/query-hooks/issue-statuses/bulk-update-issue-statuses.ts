import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { BulkUpdateIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/bulk-update-issue-statuses'

import { issueStatusKeys } from './keys.ts'

export const useBulkUpdateIssueStatusesMutation = (
  projectId: Project['id'],
  bulkUpdateIssueStatuses: BulkUpdateIssueStatusesUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkUpdateIssueStatuses,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
    },
  })
}
