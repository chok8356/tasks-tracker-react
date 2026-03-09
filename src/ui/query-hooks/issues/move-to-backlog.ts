import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { MoveToBacklog } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useMoveToBacklogMutation = (
  projectId: Project['id'],
  moveToBacklog: MoveToBacklog,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveToBacklog,
    onSuccess: (res) => {
      if (res.ok) {
        return Promise.all([
          queryClient.invalidateQueries({
            queryKey: issueKeys.backlog(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: issueKeys.board(projectId),
          }),
          queryClient.invalidateQueries({
            queryKey: issueKeys.detail(res.value.id),
          }),
        ])
      }
    },
  })
}
