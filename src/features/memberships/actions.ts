import type { Project, ProjectMembership, User } from '@/domain/types.ts'
import type { AsyncResult, InfraError } from '@/shared/result.ts'

export type GetCurrentUserRole = (
  projectId: Project['id'],
) => AsyncResult<ProjectMembership['role'], InfraError>

export type GetMemberships = (
  projectId: Project['id'],
) => AsyncResult<ProjectMembership[], InfraError>

export type InviteMember = (input: {
  email: User['email']
  projectId: Project['id']
  role: ProjectMembership['role']
}) => AsyncResult<ProjectMembership, InfraError>

export type RemoveMember = (input: {
  projectId: Project['id']
  userId: User['id']
}) => AsyncResult<void, InfraError>

export type UpdateMemberRole = (input: {
  projectId: Project['id']
  role: ProjectMembership['role']
  userId: User['id']
}) => AsyncResult<ProjectMembership, InfraError>
