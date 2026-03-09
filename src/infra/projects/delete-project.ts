import type { DeleteProject } from '@/features/projects/actions.ts'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const deleteProject: DeleteProject = async (id) => {
  try {
    await fakeFetch.projects.delete({ id })
    return ok(undefined)
  } catch (error) {
    return err(toInfraError(error))
  }
}
