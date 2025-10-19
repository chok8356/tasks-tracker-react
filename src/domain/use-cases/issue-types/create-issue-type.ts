import type { IssueType } from '@/domain/types.ts'

export type CreateIssueTypeUseCase = (
  req: Omit<IssueType, 'id' | 'order'>,
) => Promise<IssueType>
