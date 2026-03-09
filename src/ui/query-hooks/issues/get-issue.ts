import { useQuery } from '@tanstack/react-query'

import type { Issue } from '@/domain/types.ts'
import type { GetIssue } from '@/features/issues/actions.ts'

import { issueKeys } from './keys.ts'

export const useIssueQuery = (id: Issue['id'], getIssue: GetIssue) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getIssue(id),
    queryKey: issueKeys.detail(id),
  })
}
