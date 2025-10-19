import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type AuthUpdateCurrentUserRequest = Partial<
  Omit<UserDTO, 'email' | 'id'>
>
export type AuthUpdateCurrentUserResponse = UserDTO

export const updateCurrentUser = async (
  req: AuthUpdateCurrentUserRequest,
): Promise<AuthUpdateCurrentUserResponse> => {
  await fakeApiDelay()

  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const user = await db.get('users', userId)

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser: UserDTO = {
    ...user,
    ...req,
    updated_at: new Date().toISOString(),
  }

  await db.put('users', updatedUser)

  return updatedUser
}
