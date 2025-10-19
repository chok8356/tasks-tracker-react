import type { ProjectMembershipDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type MembershipsGetCurrentUserRoleRequest = Pick<
  ProjectMembershipDTO,
  'project_id'
>
export type MembershipsGetCurrentUserRoleResponse = ProjectMembershipDTO['role']

export const getCurrentUserRole = async (
  req: MembershipsGetCurrentUserRoleRequest,
): Promise<MembershipsGetCurrentUserRoleResponse> => {
  await fakeApiDelay()
  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const memberships = await db.getAll('project_memberships')
  const membership = memberships.find(
    (m) => m.project_id === req.project_id && m.user_id === userId,
  )

  return membership?.role ?? 'viewer'
}
