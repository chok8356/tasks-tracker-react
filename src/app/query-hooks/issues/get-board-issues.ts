import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetBoardIssuesUseCase } from '@/domain/use-cases/issues/get-board-issues'

import { issueKeys } from './keys.ts'

export const useBoardIssuesQuery = (
  projectId: Project['id'],
  getBoardIssues: GetBoardIssuesUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getBoardIssues(projectId),
    queryKey: issueKeys.board(projectId),
  })
}
