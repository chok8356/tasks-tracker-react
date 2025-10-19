import type { Issue, Project } from '@/domain/types.ts'

export type MoveToBoardUseCase = (req: {
  issueId: Issue['id']
  projectId: Project['id']
}) => Promise<Issue>
