import { nanoid } from 'nanoid'

import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type UsersCreateRequest = Pick<UserDTO, 'email' | 'name'>
export type UsersCreateResponse = UserDTO

export const create = async (
  req: UsersCreateRequest,
): Promise<UsersCreateResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const users = await db.getAll('users')
  if (users.some((u) => u.email === req.email)) {
    throw new Error('User already exists')
  }

  const newUser: UserDTO = {
    created_at: new Date().toISOString(),
    email: req.email,
    id: nanoid(),
    name: req.name,
    updated_at: new Date().toISOString(),
  }

  await db.add('users', newUser)

  return newUser
}
