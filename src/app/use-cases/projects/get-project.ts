import type { GetProjectUseCase } from '@/domain/use-cases/projects/get-project'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getProjectUseCase: GetProjectUseCase = async (id) => {
  const projectDto = await fakeFetch.projects.getById({ id })
  return mapProjectDtoToDomain(projectDto)
}
