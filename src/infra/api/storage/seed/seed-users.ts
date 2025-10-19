import { nanoid } from 'nanoid'

import type { UserDTO } from '@/infra/api/api-types.ts'

import { dbPromise } from '@/infra/api/storage/db.ts'

export async function seedUsers(): Promise<UserDTO[]> {
  const db = await dbPromise
  const now = new Date().toISOString()

  const users: UserDTO[] = [
    {
      created_at: now,
      email: 'alice@example.com',
      id: nanoid(),
      name: 'Alice Johnson',
      updated_at: now,
    },
    {
      created_at: now,
      email: 'bob@example.com',
      id: nanoid(),
      name: 'Bob Smith',
      updated_at: now,
    },
    {
      created_at: now,
      email: 'charlie@example.com',
      id: nanoid(),
      name: 'Charlie Brown',
      updated_at: now,
    },
  ]

  for (const user of users) {
    await db.add('users', user)
  }

  console.info(`Seeded ${users.length} users`)

  return users
}
