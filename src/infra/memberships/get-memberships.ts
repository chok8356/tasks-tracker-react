import type { GetMemberships } from '@/features/memberships/actions.ts'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const getMemberships: GetMemberships = async (projectId) => {
  try {
    const dtos = await fakeFetch.memberships.getAll({ project_id: projectId })
    return ok(dtos.map(mapMembershipDtoToDomain))
  } catch (error) {
    return err(toInfraError(error))
  }
}
