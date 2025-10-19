import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateIssueTypeUseCase } from '@/domain/use-cases/issue-types/create-issue-type'

import { issueTypeKeys } from './keys.ts'

export const useCreateIssueTypeMutation = (
  createIssueType: CreateIssueTypeUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssueType,
    onSuccess: (data) => {
      return queryClient.invalidateQueries({
        queryKey: issueTypeKeys.list(data.projectId),
      })
    },
  })
}
