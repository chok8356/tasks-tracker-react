import { nanoid } from 'nanoid'

import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { generateTokens } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type AuthRegisterRequest = {
  email: string
  password: string
}
export type AuthRegisterResponse = { accessToken: string }

export const register = async (
  req: AuthRegisterRequest,
): Promise<AuthRegisterResponse> => {
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
    name: req.email.split('@')[0] ?? req.email,
    updated_at: new Date().toISOString(),
  }

  await db.add('users', newUser)

  const { accessToken } = await generateTokens({
    email: newUser.email,
    userId: newUser.id,
  })

  return {
    accessToken,
  }
}
