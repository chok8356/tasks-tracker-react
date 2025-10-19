import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { BulkUpdateIssuesUseCase } from '@/domain/use-cases/issues/bulk-update-issues'

import { issueKeys } from './keys.ts'

export const useBulkUpdateIssuesMutation = (
  projectId: Project['id'],
  bulkUpdateIssues: BulkUpdateIssuesUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkUpdateIssues,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueKeys.backlog(projectId),
        }),
        queryClient.invalidateQueries({ queryKey: issueKeys.board(projectId) }),
      ])
    },
  })
}
