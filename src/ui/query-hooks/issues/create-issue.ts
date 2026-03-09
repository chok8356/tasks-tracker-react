import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { CreateIssue } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useCreateIssueMutation = (
  projectId: Project['id'],
  createIssue: CreateIssue,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssue,
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
