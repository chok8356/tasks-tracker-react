import { nanoid } from 'nanoid'

import type {
  ProjectDTO,
  ProjectMembershipDTO,
  UserDTO,
} from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedMemberships(
  projects: ProjectDTO[],
  users: UserDTO[],
): Promise<ProjectMembershipDTO[]> {
  const db = await dbPromise
  const now = new Date().toISOString()
  const [firstProject, secondProject] = projects
  const [firstUser, secondUser, thirdUser] = users

  if (!firstProject || !secondProject) {
    throw new Error('Expected at least two projects to seed memberships')
  }

  if (!firstUser || !secondUser || !thirdUser) {
    throw new Error('Expected at least three users to seed memberships')
  }

  const memberships: ProjectMembershipDTO[] = [
    {
      id: nanoid(),
      joined_at: now,
      project_id: firstProject.id,
      role: 'admin',
      user_id: firstUser.id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: firstProject.id,
      role: 'member',
      user_id: secondUser.id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: firstProject.id,
      role: 'member',
      user_id: thirdUser.id,
    },

    {
      id: nanoid(),
      joined_at: now,
      project_id: secondProject.id,
      role: 'admin',
      user_id: secondUser.id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: secondProject.id,
      role: 'member',
      user_id: firstUser.id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: secondProject.id,
      role: 'member',
      user_id: thirdUser.id,
    },
  ]

  for (const membership of memberships) {
    await db.add('project_memberships', membership)
  }

  console.info(`Seeded ${memberships.length} project memberships`)

  return memberships
}
