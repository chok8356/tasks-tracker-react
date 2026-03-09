import type { ProjectDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type ProjectsDeleteRequest = Pick<ProjectDTO, 'id'>
export type ProjectsDeleteResponse = undefined

export const deleteProject = async (
  req: ProjectsDeleteRequest,
): Promise<ProjectsDeleteResponse> => {
  const { userId } = await getAuthenticatedUserId()
  await fakeApiDelay()

  const db = await dbPromise

  const project = await db.get('projects', req.id)
  if (!project || project.owner_id !== userId) {
    throw new Error('Access denied')
  }

  await db.delete('projects', req.id)

  const memberships = await db.getAll('project_memberships')
  for (const membership of memberships) {
    if (membership.project_id === req.id) {
      await db.delete('project_memberships', membership.id)
    }
  }

  const issueTypes = await db.getAll('project_types')
  for (const type of issueTypes) {
    if (type.project_id === req.id) {
      await db.delete('project_types', type.id)
    }
  }

  const issueStatuses = await db.getAll('project_statuses')
  for (const status of issueStatuses) {
    if (status.project_id === req.id) {
      await db.delete('project_statuses', status.id)
    }
  }

  const issues = await db.getAll('issues')
  for (const issue of issues) {
    if (issue.project_id === req.id) {
      await db.delete('issues', issue.id)
    }
  }

  return undefined
}
