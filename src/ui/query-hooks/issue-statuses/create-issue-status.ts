import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateIssueStatus } from '@/features/issue-statuses/actions.ts'

import { issueStatusKeys } from './keys.ts'

export const useCreateIssueStatusMutation = (
  createIssueStatus: CreateIssueStatus,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssueStatus,
    onSuccess: (res, input) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueStatusKeys.list(input.projectId),
        })
      }
    },
  })
}
