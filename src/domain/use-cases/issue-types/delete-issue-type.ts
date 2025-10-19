import type { IssueType } from '@/domain/types.ts'

export type DeleteIssueTypeUseCase = (typeId: IssueType['id']) => Promise<void>
