import type { IssueStatus } from '@/domain/types.ts'

export type CreateIssueStatusUseCase = (
  req: Omit<IssueStatus, 'id' | 'order'>,
) => Promise<IssueStatus>
