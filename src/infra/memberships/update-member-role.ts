import type { UpdateMemberRole } from '@/features/memberships/actions.ts'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'
import { err, ok, toInfraError } from '@/shared/result.ts'

export const updateMemberRole: UpdateMemberRole = async (input) => {
  try {
    await fakeFetch.memberships.updateRole({
      role: input.role,
      user_id: input.userId,
    })

    const memberships = await fakeFetch.memberships.getAll({
      project_id: input.projectId,
    })
    const membership = memberships.find((m) => m.user_id === input.userId)

    if (!membership) {
      throw new Error('Membership not found after update')
    }

    return ok(mapMembershipDtoToDomain(membership))
  } catch (error) {
    return err(toInfraError(error))
  }
}
