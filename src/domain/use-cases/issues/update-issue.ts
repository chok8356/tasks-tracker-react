import type { Issue } from '@/domain/types.ts'

export type UpdateIssueUseCase = (
  req: Partial<Omit<Issue, 'projectId'>> & Pick<Issue, 'id'>,
) => Promise<Issue>
