import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { UpdateProjectUseCase } from '@/domain/use-cases/projects/update-project'

import { projectKeys } from './keys.ts'

export const useUpdateProjectMutation = (
  id: Project['id'],
  updateProject: UpdateProjectUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (data) => {
      queryClient.setQueryData(projectKeys.detail(id), data)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
      ])
    },
  })
}
