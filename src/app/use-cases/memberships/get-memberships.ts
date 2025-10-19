import type { GetMembershipsUseCase } from '@/domain/use-cases/memberships/get-memberships'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const getMembershipsUseCase: GetMembershipsUseCase = async (
  projectId,
) => {
  const dtos = await fakeFetch.memberships.getAll({ project_id: projectId })
  return dtos.map(mapMembershipDtoToDomain)
}
