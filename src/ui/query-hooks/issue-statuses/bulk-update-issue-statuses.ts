import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { BulkUpdateIssueStatuses } from '@/features/issue-statuses/actions.ts'

import { issueStatusKeys } from './keys.ts'

export const useBulkUpdateIssueStatusesMutation = (
  projectId: Project['id'],
  bulkUpdateIssueStatuses: BulkUpdateIssueStatuses,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkUpdateIssueStatuses,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(projectId),
        })
      }
    },
  })
}
