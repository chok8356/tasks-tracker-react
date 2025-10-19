import type { GetProjectsUseCase } from '@/domain/use-cases/projects/get-projects'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getProjectsUseCase: GetProjectsUseCase = async () => {
  const projectsDto = await fakeFetch.projects.getAll()
  return projectsDto.map(mapProjectDtoToDomain)
}
