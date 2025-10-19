import type { User } from '@/domain/types.ts'
import type { UserDTO } from '@/infra/api/api-types.ts'

export const mapUserDtoToDomain = (dto: UserDTO): User => {
  return {
    email: dto.email,
    id: dto.id,
    name: dto.name,
  }
}
