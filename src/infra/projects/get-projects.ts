import type { GetProjects } from '@/features/projects/actions.ts'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getProjects: GetProjects = async () => {
  try {
    const projectsDto = await fakeFetch.projects.getAll()
    return ok(projectsDto.map(mapProjectDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
