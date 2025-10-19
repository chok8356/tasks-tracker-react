import type { Project, ProjectMembership } from '@/domain/types.ts'

export type GetMembershipsUseCase = (
  projectId: Project['id'],
) => Promise<ProjectMembership[]>
