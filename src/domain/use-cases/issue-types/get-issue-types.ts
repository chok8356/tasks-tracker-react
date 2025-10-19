import type { IssueType, Project } from '@/domain/types.ts'

export type GetIssueTypesUseCase = (
  projectId: Project['id'],
) => Promise<IssueType[]>
