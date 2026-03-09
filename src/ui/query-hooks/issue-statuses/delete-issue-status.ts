import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssueStatus } from '@/features/issue-statuses/actions.ts'

import { issueStatusKeys } from './keys.ts'

export const useDeleteIssueStatusMutation = (
  projectId: Project['id'],
  deleteIssueStatus: DeleteIssueStatus,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssueStatus,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(projectId),
        })
      }
    },
  })
}
