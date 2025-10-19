import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type UsersGetAllResponse = UserDTO[]

export const getAll = async (): Promise<UsersGetAllResponse> => {
  await getAuthenticatedUserId()
  await fakeApiDelay()

  const db = await dbPromise

  const users = await db.getAll('users')

  return users
}
