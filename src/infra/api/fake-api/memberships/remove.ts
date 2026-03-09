import type { ProjectMembershipDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type MembershipsRemoveRequest = Pick<ProjectMembershipDTO, 'user_id'>
export type MembershipsRemoveResponse = undefined

export const remove = async (
  req: MembershipsRemoveRequest,
): Promise<MembershipsRemoveResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const memberships = await db.getAll('project_memberships')
  const targetMembership = memberships.find((m) => m.user_id === req.user_id)
  if (!targetMembership) {
    throw new Error('Membership not found')
  }

  await checkProjectAdmin(targetMembership.project_id)

  await db.delete('project_memberships', targetMembership.id)

  return undefined
}
