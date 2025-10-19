import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase = async (
  projectId,
) => {
  return await fakeFetch.memberships.getCurrentUserRole({
    project_id: projectId,
  })
}
