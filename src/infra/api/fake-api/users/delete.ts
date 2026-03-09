import type { IssueDTO, UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type UsersDeleteRequest = Pick<UserDTO, 'id'>
export type UsersDeleteResponse = undefined

export const deleteUsers = async (
  req: UsersDeleteRequest,
): Promise<UsersDeleteResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const user = await db.get('users', req.id)
  if (!user) {
    throw new Error('User not found')
  }

  const projects = await db.getAll('projects')
  const userOwnedProjects = projects.filter((p) => p.owner_id === req.id)

  if (userOwnedProjects.length > 0) {
    throw new Error('Cannot delete user who owns projects')
  }

  const memberships = await db.getAll('project_memberships')
  const userMemberships = memberships.filter((m) => m.user_id === req.id)

  const allIssues = await db.getAll('issues')

  for (const issue of allIssues) {
    let needsUpdate = false
    let updatedIssue: IssueDTO = { ...issue }

    if (userMemberships.some((m) => m.id === issue.assignee_id)) {
      updatedIssue = { ...updatedIssue, assignee_id: null }
      needsUpdate = true
    }

    if (userMemberships.some((m) => m.id === issue.reporter_id)) {
      const projectMembers = memberships.filter(
        (m) => m.project_id === issue.project_id && m.user_id !== req.id,
      )
      const fallbackReporter = projectMembers[0]
      const newReporter = fallbackReporter ? fallbackReporter.id : null
      updatedIssue = { ...updatedIssue, reporter_id: newReporter }
      needsUpdate = true
    }

    if (needsUpdate) {
      await db.put('issues', updatedIssue)
    }
  }

  for (const membership of userMemberships) {
    await db.delete('project_memberships', membership.id)
  }

  await db.delete('users', req.id)

  return undefined
}
