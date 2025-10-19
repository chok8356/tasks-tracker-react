import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateProjectUseCase } from '@/domain/use-cases/projects/create-project'

import { projectKeys } from './keys.ts'

export const useCreateProjectMutation = (
  createProject: CreateProjectUseCase,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}
