import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type UsersGetByIdRequest = Pick<UserDTO, 'id'>
export type UsersGetByIdResponse = UserDTO

export const getById = async (
  req: UsersGetByIdRequest,
): Promise<UsersGetByIdResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const user = await db.get('users', req.id)
  if (!user) {
    throw new Error('User not found')
  }

  return user
}
