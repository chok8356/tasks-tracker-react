import type { Project } from '@/domain/types'
import type { ProjectDTO } from '@/infra/api/api-types.ts'

export function mapProjectDtoToDomain(dto: ProjectDTO): Project {
  return {
    createdAt: new Date(dto.created_at),
    description: dto.description ?? '',
    id: dto.id,
    key: dto.key,
    name: dto.name,
    ownerId: dto.owner_id,
    updatedAt: new Date(dto.updated_at),
  }
}
