import type { IssueStatus, Project } from '@/domain/types.ts'

export type GetIssueStatusesUseCase = (
  projectId: Project['id'],
) => Promise<IssueStatus[]>
