import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateIssueType } from '@/features/issue-types/actions.ts'

import { issueTypeKeys } from './keys.ts'

export const useCreateIssueTypeMutation = (
  createIssueType: CreateIssueType,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssueType,
    onSuccess: (res, input) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueTypeKeys.list(input.projectId),
        })
      }
    },
  })
}
