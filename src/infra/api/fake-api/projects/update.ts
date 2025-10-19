import type { ProjectDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { checkProjectAdmin } from '@/infra/api/fake-api-utils.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type ProjectsUpdateRequest = Partial<
  Omit<
    ProjectDTO,
    'created_at' | 'id' | 'last_issue_number' | 'owner_id' | 'updated_at'
  >
> &
  Pick<ProjectDTO, 'id'>
export type ProjectsUpdateResponse = ProjectDTO

export const update = async (
  req: ProjectsUpdateRequest,
): Promise<ProjectsUpdateResponse> => {
  await checkProjectAdmin(req.id)
  await fakeApiDelay()

  const db = await dbPromise

  const project = await db.get('projects', req.id)
  if (!project) {
    throw new Error('Project not found')
  }

  const updatedProject: ProjectDTO = {
    ...project,
    ...req,
    updated_at: new Date().toISOString(),
  }

  await db.put('projects', updatedProject)

  return updatedProject
}
