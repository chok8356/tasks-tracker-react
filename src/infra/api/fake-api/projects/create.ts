import { nanoid } from 'nanoid'

import type { ProjectDTO, ProjectMembershipDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type ProjectsCreateRequest = Pick<
  ProjectDTO,
  'description' | 'key' | 'name'
>
export type ProjectsCreateResponse = ProjectDTO

export const create = async (
  req: ProjectsCreateRequest,
): Promise<ProjectsCreateResponse> => {
  const { userId } = await getAuthenticatedUserId()
  await fakeApiDelay()

  const db = await dbPromise
  const now = new Date().toISOString()

  const newProject: ProjectDTO = {
    created_at: now,
    description: req.description,
    id: nanoid(),
    key: req.key,
    last_issue_number: 0,
    name: req.name,
    owner_id: userId,
    updated_at: now,
  }

  await db.add('projects', newProject)

  const newMembership: ProjectMembershipDTO = {
    id: nanoid(),
    joined_at: now,
    project_id: newProject.id,
    role: 'admin',
    user_id: userId,
  }

  await db.add('project_memberships', newMembership)

  return newProject
}
