import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Issue } from '@/domain/types.ts'
import type { UpdateIssueUseCase } from '@/domain/use-cases/issues/update-issue'

import { issueKeys } from './keys.ts'

export const useUpdateIssueMutation = (
  issueId: Issue['id'],
  updateIssue: UpdateIssueUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssue,
    onSuccess: (data) => {
      queryClient.setQueryData(issueKeys.detail(issueId), data)
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueKeys.detail(issueId),
        }),
        queryClient.invalidateQueries({
          queryKey: issueKeys.backlog(data.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: issueKeys.board(data.projectId),
        }),
      ])
    },
  })
}
