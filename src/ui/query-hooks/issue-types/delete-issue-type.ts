import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteIssueType } from '@/features/issue-types/actions.ts'

import { issueTypeKeys } from './keys.ts'

export const useDeleteIssueTypeMutation = (
  projectId: Project['id'],
  deleteIssueType: DeleteIssueType,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssueType,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueTypeKeys.list(projectId),
        })
      }
    },
  })
}
