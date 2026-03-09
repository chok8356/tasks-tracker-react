import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateProject } from '@/features/projects/actions.ts'

import { projectKeys } from './keys.ts'

export const useUpdateProjectMutation = (updateProject: UpdateProject) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (res) => {
      if (res.ok) {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(res.value.id),
          }),
        ])
      }
    },
  })
}
