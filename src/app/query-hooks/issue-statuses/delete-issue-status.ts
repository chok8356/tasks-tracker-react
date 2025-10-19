import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/delete-issue-status'

import { issueStatusKeys } from './keys.ts'

export const useDeleteIssueStatusMutation = (
  projectId: Project['id'],
  deleteIssueStatus: DeleteIssueStatusUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssueStatus,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(projectId),
        }),
      ])
    },
  })
}
