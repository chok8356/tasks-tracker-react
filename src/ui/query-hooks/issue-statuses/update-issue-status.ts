import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateIssueStatus } from '@/features/issue-statuses/actions.ts'

import { issueStatusKeys } from './keys.ts'

export const useUpdateIssueStatusMutation = (
  projectId: Project['id'],
  updateIssueStatus: UpdateIssueStatus,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssueStatus,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(projectId),
        })
      }
    },
  })
}
