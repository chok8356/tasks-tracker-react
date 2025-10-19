import type { ProjectMembershipDTO } from '@/infra/api/api-types.ts'

import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export const checkProjectMembership = async (
  projectId: string,
): Promise<ProjectMembershipDTO['id']> => {
  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const memberships = await db.getAll('project_memberships')
  const membership = memberships.find(
    (m) => m.project_id === projectId && m.user_id === userId,
  )

  if (!membership) {
    throw new Error('Access denied')
  }

  return membership.id
}

export const checkProjectAdmin = async (projectId: string): Promise<void> => {
  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const memberships = await db.getAll('project_memberships')
  const membership = memberships.find(
    (m) => m.project_id === projectId && m.user_id === userId,
  )

  if (!membership || membership.role !== 'admin') {
    throw new Error('Access denied')
  }
}
