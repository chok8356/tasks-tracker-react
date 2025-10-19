import type { IssueStatus } from '@/domain/types.ts'
import type { IssueStatusDTO } from '@/infra/api/api-types.ts'

export const mapIssueStatusDtoToDomain = (dto: IssueStatusDTO): IssueStatus => {
  return {
    category: dto.category,
    id: dto.id,
    name: dto.name,
    order: dto.order,
    projectId: dto.project_id,
  }
}
