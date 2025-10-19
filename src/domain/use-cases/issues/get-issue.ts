import type { Issue } from '@/domain/types.ts'

export type GetIssueUseCase = (id: Issue['id']) => Promise<Issue>
