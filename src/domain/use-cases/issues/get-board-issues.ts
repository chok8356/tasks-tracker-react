import type { Issue, Project } from '@/domain/types.ts'

export type GetBoardIssuesUseCase = (
  projectId: Project['id'],
) => Promise<Issue[]>
