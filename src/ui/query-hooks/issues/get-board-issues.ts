import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetBoardIssues } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useBoardIssuesQuery = (
  projectId: Project['id'],
  getBoardIssues: GetBoardIssues,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getBoardIssues(projectId),
    queryKey: issueKeys.board(projectId),
  })
}
