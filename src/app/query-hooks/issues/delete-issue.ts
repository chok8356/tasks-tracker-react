import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssueUseCase } from '@/domain/use-cases/issues/delete-issue'

import { issueKeys } from './keys.ts'

export const useDeleteIssueMutation = (
  projectId: Project['id'],
  deleteIssue: DeleteIssueUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssue,
    onSuccess: (_data, issueId) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueKeys.detail(issueId),
        }),
        queryClient.invalidateQueries({
          queryKey: issueKeys.backlog(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: issueKeys.board(projectId),
        }),
      ])
    },
  })
}
