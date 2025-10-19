import type { InviteMemberUseCase } from '@/domain/use-cases/memberships/invite-member'

import { mapMembershipDtoToDomain } from '@/infra/acl/membership-mappers.ts'
import { fakeFetch } from '@/infra/api/fake-fetch.ts'

export const inviteMemberUseCase: InviteMemberUseCase = async (req) => {
  const dto = await fakeFetch.memberships.invite({
    email: req.email,
    id: req.projectId,
    role: req.role,
  })
  return mapMembershipDtoToDomain(dto)
}
