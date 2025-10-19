import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateIssueTypeUseCase } from '@/domain/use-cases/issue-types/update-issue-type'

import { issueTypeKeys } from './keys.ts'

export const useUpdateIssueTypeMutation = (
  projectId: Project['id'],
  updateIssueType: UpdateIssueTypeUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssueType,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueTypeKeys.list(projectId),
        }),
      ])
    },
  })
}
