import { fakeApiDelay } from '@/infra/api/fake-api-delay.ts'
import { generateTokens } from '@/infra/api/session.ts'
import { dbPromise } from '@/infra/api/storage/db.ts'

export type AuthLoginRequest = {
  email: string
  password: string
}
export type AuthLoginResponse = { accessToken: string }

export const login = async (
  req: AuthLoginRequest,
): Promise<AuthLoginResponse> => {
  await fakeApiDelay()

  const db = await dbPromise
  const users = await db.getAll('users')
  const user = users.find((u) => u.email === req.email)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const { accessToken } = await generateTokens({
    email: user.email,
    userId: user.id,
  })

  return {
    accessToken,
  }
}
