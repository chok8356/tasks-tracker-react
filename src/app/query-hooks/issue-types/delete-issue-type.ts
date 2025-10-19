import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssueTypeUseCase } from '@/domain/use-cases/issue-types/delete-issue-type'

import { issueTypeKeys } from './keys.ts'

export const useDeleteIssueTypeMutation = (
  projectId: Project['id'],
  deleteIssueType: DeleteIssueTypeUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssueType,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: issueTypeKeys.list(projectId),
        }),
      ])
    },
  })
}
