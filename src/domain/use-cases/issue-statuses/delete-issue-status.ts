import type { IssueStatus } from '@/domain/types.ts'

export type DeleteIssueStatusUseCase = (
  statusId: IssueStatus['id'],
) => Promise<void>
