import { nanoid } from 'nanoid'

import type {
  ProjectDTO,
  ProjectMembershipDTO,
  UserDTO,
} from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type MembershipsInviteRequest = Pick<ProjectDTO, 'id'> &
  Pick<ProjectMembershipDTO, 'role'> &
  Pick<UserDTO, 'email'>
export type MembershipsInviteResponse = ProjectMembershipDTO & { user: UserDTO }

export const invite = async (
  req: MembershipsInviteRequest,
): Promise<MembershipsInviteResponse> => {
  await checkProjectAdmin(req.id)
  await fakeApiDelay()

  const db = await dbPromise

  const users = await db.getAll('users')
  const user = users.find((u) => u.email === req.email)
  if (!user) {
    throw new Error('User not found')
  }

  const memberships = await db.getAll('project_memberships')
  const existingMembership = memberships.find(
    (m) => m.project_id === req.id && m.user_id === user.id,
  )
  if (existingMembership) {
    throw new Error('User is already a member')
  }

  const newMembership: ProjectMembershipDTO = {
    id: nanoid(),
    joined_at: new Date().toISOString(),
    project_id: req.id,
    role: req.role,
    user_id: user.id,
  }

  await db.add('project_memberships', newMembership)

  return { ...newMembership, user }
}
