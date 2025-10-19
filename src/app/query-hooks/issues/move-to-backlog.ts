import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { MoveToBacklogUseCase } from '@/domain/use-cases/issues/move-to-backlog'

import { issueKeys } from './keys.ts'

export const useMoveToBacklogMutation = (
  projectId: Project['id'],
  moveToBacklog: MoveToBacklogUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveToBacklog,
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
