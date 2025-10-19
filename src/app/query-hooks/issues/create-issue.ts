import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { CreateIssueUseCase } from '@/domain/use-cases/issues/create-issue'

import { issueKeys } from './keys.ts'

export const useCreateIssueMutation = (
  projectId: Project['id'],
  createIssue: CreateIssueUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssue,
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
