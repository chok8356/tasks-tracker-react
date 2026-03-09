import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { DeleteProject } from '@/features/projects/actions.ts'

import { projectKeys } from './keys.ts'

export const useDeleteProjectMutation = (deleteProject: DeleteProject) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      }
    },
  })
}
