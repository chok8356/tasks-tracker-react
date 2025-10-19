import type { Issue, Project } from '@/domain/types.ts'

export type GetBacklogIssuesUseCase = (
  projectId: Project['id'],
) => Promise<Issue[]>
