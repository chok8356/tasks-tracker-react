import type { ProjectDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectMembership } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type ProjectsGetByIdRequest = Pick<ProjectDTO, 'id'>
export type ProjectsGetByIdResponse = ProjectDTO

export const getById = async (
  req: ProjectsGetByIdRequest,
): Promise<ProjectsGetByIdResponse> => {
  await checkProjectMembership(req.id)
  await fakeApiDelay()

  const db = await dbPromise

  const project = await db.get('projects', req.id)
  if (!project) {
    throw new Error('Project not found')
  }

  return project
}
