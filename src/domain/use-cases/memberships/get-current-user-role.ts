import type { Project, ProjectMembership } from '@/domain/types.ts'

export type GetCurrentUserRoleUseCase = (
  projectId: Project['id'],
) => Promise<ProjectMembership['role']>
