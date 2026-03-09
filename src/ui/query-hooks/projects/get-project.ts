import { useQuery } from '@tanstack/react-query'

import type { Project } from '@/domain/types.ts'
import type { GetProject } from '@/features/projects/actions.ts'

import { projectKeys } from './keys.ts'

export const useProjectQuery = (id: Project['id'], getProject: GetProject) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getProject(id),
    queryKey: projectKeys.detail(id),
  })
}
