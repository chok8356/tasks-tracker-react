import type { Project } from '@/domain/types.ts'

export const issueTypeKeys = {
  all: ['issue-types'] as const,
  list: (projectId: Project['id']) =>
    [...issueTypeKeys.lists(), { projectId }] as const,
  lists: () => [...issueTypeKeys.all, 'list'] as const,
}
