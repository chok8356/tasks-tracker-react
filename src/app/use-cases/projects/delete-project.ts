import type { DeleteProjectUseCase } from '@/domain/use-cases/projects/delete-project'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const deleteProjectUseCase: DeleteProjectUseCase = async (id) => {
  await fakeFetch.projects.delete({ id })
}
