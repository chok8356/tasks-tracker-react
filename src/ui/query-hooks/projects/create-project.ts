import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateProject } from '@/features/projects/actions.ts'

import { projectKeys } from './keys.ts'

export const useCreateProjectMutation = (createProject: CreateProject) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: (res) => {
      if (res.ok) {
        return queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      }
    },
  })
}
