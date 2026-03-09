import type { InviteMember } from '@/features/memberships/actions.ts'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const inviteMember: InviteMember = async (input) => {
  try {
    const dto = await fakeFetch.memberships.invite({
      email: input.email,
      id: input.projectId,
      role: input.role,
    })
    return ok(mapMembershipDtoToDomain(dto))
  } catch (error) {
    return err(toInfraError(error))
  }
}
