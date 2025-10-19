import type { Project, ProjectMembership, User } from '@/domain/types.ts'

export type InviteMemberUseCase = (req: {
  email: User['email']
  projectId: Project['id']
  role: ProjectMembership['role']
}) => Promise<ProjectMembership>
