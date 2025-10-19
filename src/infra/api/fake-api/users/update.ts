import type { UserDTO } from '@/infra/api/api-types.ts'

import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type UsersUpdateRequest = Partial<
  Omit<UserDTO, 'created_at' | 'email' | 'id' | 'updated_at'>
> &
  Pick<UserDTO, 'id'>
export type UsersUpdateResponse = UserDTO

export const update = async (
  req: UsersUpdateRequest,
): Promise<UsersUpdateResponse> => {
  await fakeApiDelay()

  const db = await dbPromise

  const user = await db.get('users', req.id)
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
