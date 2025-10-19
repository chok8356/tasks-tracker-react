import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { generateTokens, getAuthenticatedUserId } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type AuthRefreshResponse = { accessToken: string }

export const refresh = async (): Promise<AuthRefreshResponse> => {
  await fakeApiDelay()

  const { userId } = await getAuthenticatedUserId()
  const db = await dbPromise
  const user = await db.get('users', userId)

  if (!user) {
    throw new Error('User not found')
  }

  const { accessToken } = await generateTokens({
    email: user.email,
    userId: user.id,
  })

  return {
    accessToken,
  }
}
