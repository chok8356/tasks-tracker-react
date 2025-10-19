import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { MoveToBoardUseCase } from '@/domain/use-cases/issues/move-to-board'

import { issueKeys } from './keys.ts'

export const useMoveToBoardMutation = (
  projectId: Project['id'],
  moveToBoard: MoveToBoardUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveToBoard,
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
