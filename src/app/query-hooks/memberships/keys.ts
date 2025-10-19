import type { Project } from '@/domain/types.ts'

export const membershipKeys = {
  all: ['memberships'] as const,
  currentUserRole: (projectId: Project['id']) =>
    [...membershipKeys.all, 'currentUserRole', { projectId }] as const,
  list: (projectId: Project['id']) =>
    [...membershipKeys.lists(), { projectId }] as const,
  lists: () => [...membershipKeys.all, 'list'] as const,
}
