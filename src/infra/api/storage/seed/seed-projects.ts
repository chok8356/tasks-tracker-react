import { nanoid } from 'nanoid'

import type { ProjectDTO, UserDTO } from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedProjects(users: UserDTO[]): Promise<ProjectDTO[]> {
  const db = await dbPromise
  const now = new Date().toISOString()
  const [firstUser, secondUser] = users

  if (!firstUser || !secondUser) {
    throw new Error('Expected at least two users to seed projects')
  }

  const projects: ProjectDTO[] = [
    {
      created_at: now,
      description: '',
      id: nanoid(),
      key: 'WEB',
      last_issue_number: 5,
      name: 'Website Redesign',
      owner_id: firstUser.id,
      updated_at: now,
    },
    {
      created_at: now,
      description: '',
      id: nanoid(),
      key: 'MOB',
      last_issue_number: 5,
      name: 'Mobile App Development',
      owner_id: secondUser.id,
      updated_at: now,
    },
  ]

  for (const project of projects) {
    await db.add('projects', project)
  }

  console.info(`Seeded ${projects.length} projects`)

  return projects
}
