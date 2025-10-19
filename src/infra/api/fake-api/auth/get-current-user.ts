import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export const getCurrentUser = async (): Promise<UserDTO> => {
  await fakeApiDelay()

  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const user = await db.get('users', userId)

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
