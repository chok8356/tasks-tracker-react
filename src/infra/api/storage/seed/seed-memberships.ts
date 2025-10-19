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

  const memberships: ProjectMembershipDTO[] = [
    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[0].id,
      role: 'admin',
      user_id: users[0].id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[0].id,
      role: 'member',
      user_id: users[1].id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[0].id,
      role: 'member',
      user_id: users[2].id,
    },

    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[1].id,
      role: 'admin',
      user_id: users[1].id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[1].id,
      role: 'member',
      user_id: users[0].id,
    },
    {
      id: nanoid(),
      joined_at: now,
      project_id: projects[1].id,
      role: 'member',
      user_id: users[2].id,
    },
  ]

  for (const membership of memberships) {
    await db.add('project_memberships', membership)
  }

  console.info(`Seeded ${memberships.length} project memberships`)

  return memberships
}
