import { useQuery } from '@tanstack/react-query'

import type { Issue } from '@/domain/types.ts'
import type { GetIssueUseCase } from '@/domain/use-cases/issues/get-issue'

import { issueKeys } from './keys.ts'

export const useIssueQuery = (id: Issue['id'], getIssue: GetIssueUseCase) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getIssue(id),
    queryKey: issueKeys.detail(id),
  })
}
