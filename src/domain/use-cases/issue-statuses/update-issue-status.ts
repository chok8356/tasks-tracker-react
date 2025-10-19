import type { IssueStatus } from '@/domain/types.ts'

export type UpdateIssueStatusUseCase = (
  req: Partial<Omit<IssueStatus, 'projectId'>> & Pick<IssueStatus, 'id'>,
) => Promise<IssueStatus>
