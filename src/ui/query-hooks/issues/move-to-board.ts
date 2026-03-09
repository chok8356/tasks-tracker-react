import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { MoveToBoard } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useMoveToBoardMutation = (
  projectId: Project['id'],
  moveToBoard: MoveToBoard,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveToBoard,
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
