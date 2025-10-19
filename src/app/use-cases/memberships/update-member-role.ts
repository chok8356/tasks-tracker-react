import type { UpdateMemberRoleUseCase } from '@/domain/use-cases/memberships/update-member-role'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const updateMemberRoleUseCase: UpdateMemberRoleUseCase = async (req) => {
  await fakeFetch.memberships.updateRole({
    role: req.role,
    user_id: req.userId,
  })

  const memberships = await fakeFetch.memberships.getAll({
    project_id: req.projectId,
  })
  const membership = memberships.find((m) => m.user_id === req.userId)

  if (!membership) {
    throw new Error('Membership not found after update')
  }

  return mapMembershipDtoToDomain(membership)
}
