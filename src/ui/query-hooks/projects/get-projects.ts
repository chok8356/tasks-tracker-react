import { useQuery } from '@tanstack/react-query'

import type { GetProjects } from '@/features/projects/actions.ts'

import { projectKeys } from './keys.ts'

export const useProjectsQuery = (getProjects: GetProjects) => {
  return useQuery({
    queryFn: getProjects,
    queryKey: projectKeys.lists(),
  })
}
