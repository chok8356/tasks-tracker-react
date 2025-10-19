import type { Issue, Project } from '@/domain/types.ts'

export type BulkUpdateIssuesUseCase = (req: {
  projectId: Project['id']
  updates: Pick<Issue, 'id' | 'order' | 'statusId'>[]
}) => Promise<Issue[]>
