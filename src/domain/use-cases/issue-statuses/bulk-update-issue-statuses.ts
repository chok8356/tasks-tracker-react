import type { IssueStatus, Project } from '@/domain/types.ts'

export type BulkUpdateIssueStatusesUseCase = (req: {
  projectId: Project['id']
  updates: Partial<Pick<IssueStatus, 'id' | 'name' | 'order'>>[]
}) => Promise<IssueStatus[]>
