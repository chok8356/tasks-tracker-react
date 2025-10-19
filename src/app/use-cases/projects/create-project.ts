import type { CreateProjectUseCase } from '@/domain/use-cases/projects/create-project'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const createProjectUseCase: CreateProjectUseCase = async (req) => {
  const projectsDto = await fakeFetch.projects.create({
    description: req.description,
    key: req.key,
    name: req.name,
  })
  return mapProjectDtoToDomain(projectsDto)
}
