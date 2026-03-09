import type { CreateProject } from '@/features/projects/actions.ts'

import { mapProjectDtoToDomain } from '@/infra/acl/project-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const createProject: CreateProject = async (input) => {
  try {
    const projectDto = await fakeFetch.projects.create({
      description: input.description,
      key: input.key,
      name: input.name,
    })

    return ok(mapProjectDtoToDomain(projectDto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
