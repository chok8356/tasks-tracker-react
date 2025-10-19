import type { IssueType } from '@/domain/types.ts'

export type UpdateIssueTypeUseCase = (
  req: Partial<Omit<IssueType, 'id' | 'projectId'>> & Pick<IssueType, 'id'>,
) => Promise<IssueType>
