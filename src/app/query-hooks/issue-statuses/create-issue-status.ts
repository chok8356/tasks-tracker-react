import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/create-issue-status'

import { issueStatusKeys } from './keys.ts'

export const useCreateIssueStatusMutation = (
  createIssueStatus: CreateIssueStatusUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssueStatus,
    onSuccess: (data) => {
      return queryClient.invalidateQueries({
        queryKey: issueStatusKeys.list(data.projectId),
      })
    },
  })
}
