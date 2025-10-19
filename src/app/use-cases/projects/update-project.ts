import type { UpdateProjectUseCase } from '@/domain/use-cases/projects/update-project'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateProjectUseCase: UpdateProjectUseCase = async (req) => {
  const projectDto = await fakeFetch.projects.update(req)
  return mapProjectDtoToDomain(projectDto)
}
