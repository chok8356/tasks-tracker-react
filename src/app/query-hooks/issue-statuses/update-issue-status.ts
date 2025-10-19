import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/update-issue-status'

import { issueStatusKeys } from './keys.ts'

export const useUpdateIssueStatusMutation = (
  projectId: Project['id'],
  updateIssueStatus: UpdateIssueStatusUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssueStatus,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(projectId),
        }),
      ])
    },
  })
}
