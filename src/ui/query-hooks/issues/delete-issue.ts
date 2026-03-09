import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssue } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useDeleteIssueMutation = (
  projectId: Project['id'],
  deleteIssue: DeleteIssue,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssue,
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
