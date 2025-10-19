import type { Project } from '@/domain/types.ts'

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: Project['id']) => [...projectKeys.all, 'detail', id] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
}
