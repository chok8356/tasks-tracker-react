import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetIssueTypes } from '@/features/issue-types/actions.ts'

import { issueTypeKeys } from './keys.ts'

export const useIssueTypesQuery = (
  projectId: Project['id'],
  getIssueTypes: GetIssueTypes,
) => {
  return useQuery({
    enabled: !!projectId,
    queryFn: () => getIssueTypes(projectId),
    queryKey: issueTypeKeys.list(projectId),
  })
}
