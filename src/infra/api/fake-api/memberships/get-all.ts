import type { ProjectMembershipDTO, UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type MembershipsGetAllRequest = Pick<ProjectMembershipDTO, 'project_id'>
export type MembershipsGetAllResponse = (ProjectMembershipDTO & {
  user: UserDTO
})[]

export const getAll = async (
  req: MembershipsGetAllRequest,
): Promise<MembershipsGetAllResponse> => {
  await checkProjectMembership(req.project_id)
  await fakeApiDelay()

  const db = await dbPromise

  const memberships = await db.getAll('project_memberships')
  const projectMemberships = memberships.filter(
    (m) => m.project_id === req.project_id,
  )

  const users = await db.getAll('users')
  const userMap = new Map(users.map((u) => [u.id, u]))

  return projectMemberships.map((pm) => {
    const user = userMap.get(pm.user_id)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      ...pm,
      user,
    }
  })
}
