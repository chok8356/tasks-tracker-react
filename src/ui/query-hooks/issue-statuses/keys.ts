import type { Project } from '@/domain/types.ts'

export const issueStatusKeys = {
  all: ['issue-statuses'] as const,
  list: (projectId: Project['id']) =>
    [...issueStatusKeys.lists(), { projectId }] as const,
  lists: () => [...issueStatusKeys.all, 'list'] as const,
}
