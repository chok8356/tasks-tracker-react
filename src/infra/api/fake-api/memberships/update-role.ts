import type { ProjectMembershipDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type MembershipsUpdateRoleRequest = Pick<
  ProjectMembershipDTO,
  'role' | 'user_id'
>
export type MembershipsUpdateRoleResponse = ProjectMembershipDTO

export const updateRole = async (
  req: MembershipsUpdateRoleRequest,
): Promise<MembershipsUpdateRoleResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const memberships = await db.getAll('project_memberships')
  const targetMembership = memberships.find((m) => m.user_id === req.user_id)
  if (!targetMembership) {
    throw new Error('Membership not found')
  }

  await checkProjectAdmin(targetMembership.project_id)

  const updatedMembership: ProjectMembershipDTO = {
    ...targetMembership,
    role: req.role,
  }

  await db.put('project_memberships', updatedMembership)

  return updatedMembership
}
