import type { Issue } from '@/domain/types.ts'

export type DeleteIssueUseCase = (issueId: Issue['id']) => Promise<void>
