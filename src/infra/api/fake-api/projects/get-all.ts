import type { ProjectDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type ProjectsGetAllResponse = ProjectDTO[]

export const getAll = async (): Promise<ProjectsGetAllResponse> => {
  const { userId } = await getAuthenticatedUserId()
  await fakeApiDelay()

  const db = await dbPromise

  const memberships = await db.getAll('project_memberships')
  const userMemberships = memberships.filter((m) => m.user_id === userId)
  const projectIds = userMemberships.map((m) => m.project_id)

  const projects = await db.getAll('projects')
  const userProjects = projects.filter((p) => projectIds.includes(p.id))

  return userProjects
}
