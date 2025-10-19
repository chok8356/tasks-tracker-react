import type { IssueType } from '@/domain/types.ts'
import type { IssueTypeDTO } from '@/infra/api/api-types.ts'

import {
  ISSUE_TYPE_COLORS,
  ISSUE_TYPE_ICONS,
} from '@/shared/constants/issue-constants.tsx'

const isValidColor = (color: string): color is IssueType['color'] => {
  return ISSUE_TYPE_COLORS.includes(color as IssueType['color'])
}

const isValidIcon = (icon: string): icon is IssueType['icon'] => {
  return ISSUE_TYPE_ICONS.includes(icon as IssueType['icon'])
}

export const mapIssueTypeDtoToDomain = (dto: IssueTypeDTO): IssueType => {
  return {
    color: isValidColor(dto.color) ? dto.color : 'blue',
    icon: isValidIcon(dto.icon) ? dto.icon : 'Bug',
    id: dto.id,
    name: dto.name,
    order: dto.order,
    projectId: dto.project_id,
  }
}
