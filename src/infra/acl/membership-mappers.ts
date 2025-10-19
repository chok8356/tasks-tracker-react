import type { ProjectMembership } from '@/domain/types.ts'
import type { ProjectMembershipDTO, UserDTO } from '@/infra/api/api-types.ts'

import { mapUserDtoToDomain } from '@/infra/acl/user-mappers.ts'

export type ProjectMembershipWithUserDTO = ProjectMembershipDTO & {
  user: UserDTO
}

export const mapMembershipDtoToDomain = (
  dto: ProjectMembershipWithUserDTO,
): ProjectMembership => {
  return {
    id: dto.id,
    projectId: dto.project_id,
    role: dto.role,
    user: mapUserDtoToDomain(dto.user),
  }
}
