import type { Project, ProjectMembership, User } from '@/domain/types.ts'

export type UpdateMemberRoleUseCase = (req: {
  projectId: Project['id']
  role: ProjectMembership['role']
  userId: User['id']
}) => Promise<ProjectMembership>
