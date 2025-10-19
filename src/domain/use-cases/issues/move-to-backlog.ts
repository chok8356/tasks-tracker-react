import type { Issue, Project } from '@/domain/types.ts'

export type MoveToBacklogUseCase = (req: {
  issueId: Issue['id']
  projectId: Project['id']
}) => Promise<Issue>
