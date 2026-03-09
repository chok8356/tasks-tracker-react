import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Issue } from '@/domain/types.ts'
import type { UpdateIssue } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useUpdateIssueMutation = (
  issueId: Issue['id'],
  updateIssue: UpdateIssue,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssue,
    onSuccess: (res) => {
      if (res.ok) {
        return Promise.all([
          queryClient.invalidateQueries({
            queryKey: issueKeys.detail(issueId),
          }),
          queryClient.invalidateQueries({
            queryKey: issueKeys.backlog(res.value.projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: issueKeys.board(res.value.projectId),
          }),
        ])
      }
    },
  })
}
