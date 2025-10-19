import type { Issue } from '@/domain/types.ts'
import type { IssueDTO } from '@/infra/api/api-types.ts'

export const mapIssueDtoToDomain = (dto: IssueDTO): Issue => {
  return {
    assigneeId: dto.assignee_id,
    description: dto.description,
    estimate: dto.estimate,
    id: dto.id,
    order: dto.order,
    projectId: dto.project_id,
    reporterId: dto.reporter_id,
    statusId: dto.status_id,
    summary: dto.summary,
    typeId: dto.type_id,
  }
}
