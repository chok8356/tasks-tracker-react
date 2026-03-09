import type { UpdateProject } from '@/features/projects/actions.ts'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateProject: UpdateProject = async (input) => {
  try {
    const projectDto = await fakeFetch.projects.update(input)
    return ok(mapProjectDtoToDomain(projectDto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
