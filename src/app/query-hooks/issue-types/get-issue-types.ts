import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'

import { issueTypeKeys } from './keys.ts'

export const useIssueTypesQuery = (
  projectId: Project['id'],
  getIssueTypes: GetIssueTypesUseCase,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getIssueTypes(projectId),
    queryKey: issueTypeKeys.list(projectId),
  })
}
