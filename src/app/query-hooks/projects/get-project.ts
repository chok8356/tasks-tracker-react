import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetProjectUseCase } from '@/domain/use-cases/projects/get-project'

import { projectKeys } from './keys.ts'

export const useProjectQuery = (
  id: Project['id'],
  getProject: GetProjectUseCase,
) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getProject(id),
    queryKey: projectKeys.detail(id),
  })
}
