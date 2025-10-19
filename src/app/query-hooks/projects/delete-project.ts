import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { DeleteProjectUseCase } from '@/domain/use-cases/projects/delete-project'

import { issueStatusKeys } from '@/app/query-hooks/issue-statuses/keys.ts'
import { issueTypeKeys } from '@/app/query-hooks/issue-types/keys.ts'
import { issueKeys } from '@/app/query-hooks/issues/keys.ts'
import { membershipKeys } from '@/app/query-hooks/memberships/keys.ts'

import { projectKeys } from './keys.ts'

export const useDeleteProjectMutation = (
  deleteProject: DeleteProjectUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, projectId: Project['id']) => {
      queryClient.removeQueries({
        queryKey: issueKeys.backlog(projectId),
      })
      queryClient.removeQueries({
        queryKey: issueKeys.board(projectId),
      })
      queryClient.removeQueries({
        queryKey: issueStatusKeys.list(projectId),
      })
      queryClient.removeQueries({
        queryKey: issueTypeKeys.list(projectId),
      })
      queryClient.removeQueries({
        queryKey: membershipKeys.list(projectId),
      })
      queryClient.removeQueries({
        queryKey: projectKeys.detail(projectId),
      })

      return queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}
