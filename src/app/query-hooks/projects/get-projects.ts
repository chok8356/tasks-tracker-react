import { useQuery } from '@tanstack/react-query'

import type { GetProjectsUseCase } from '@/domain/use-cases/projects/get-projects'

import { projectKeys } from './keys.ts'

export const useProjectsQuery = (getProjects: GetProjectsUseCase) => {
  return useQuery({
    queryFn: getProjects,
    queryKey: projectKeys.lists(),
  })
}
