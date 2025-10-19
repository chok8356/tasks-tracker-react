import type { Issue } from '@/domain/types.ts'

export type CreateIssueUseCase = (
  req: Pick<Issue, 'description' | 'projectId' | 'summary' | 'typeId'>,
) => Promise<Issue>
