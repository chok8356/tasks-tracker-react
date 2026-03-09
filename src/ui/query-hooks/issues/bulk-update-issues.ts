import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { BulkUpdateIssues } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useBulkUpdateIssuesMutation = (
  projectId: Project['id'],
  bulkUpdateIssues: BulkUpdateIssues,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkUpdateIssues,
    onSuccess: (res) => {
      if (res.ok) {
        return Promise.all([
          queryClient.invalidateQueries({
            queryKey: issueKeys.backlog(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: issueKeys.board(projectId),
          }),
        ])
      }
    },
  })
}
