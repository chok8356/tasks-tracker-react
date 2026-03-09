import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateIssueType } from '@/features/issue-types/actions.ts'

import { issueTypeKeys } from './keys.ts'

export const useUpdateIssueTypeMutation = (
  projectId: Project['id'],
  updateIssueType: UpdateIssueType,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssueType,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({
          queryKey: issueTypeKeys.list(projectId),
        })
      }
    },
  })
}
