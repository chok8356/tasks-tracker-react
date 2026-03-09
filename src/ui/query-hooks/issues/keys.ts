import type { Issue, Project } from '@/domain/types.ts'

export const issueKeys = {
  all: ['issues'] as const,
  backlog: (projectId: Project['id']) =>
    [...issueKeys.lists(), 'backlog', { projectId }] as const,
  board: (projectId: Project['id']) =>
    [...issueKeys.lists(), 'board', { projectId }] as const,
  detail: (id: Issue['id']) => [...issueKeys.details(), id] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  list: (filters: string) => [...issueKeys.lists(), { filters }] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
}
