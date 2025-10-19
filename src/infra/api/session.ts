import { SignJWT } from 'jose'

import { useSession } from '@/shared/use-session.ts'

export type Session = {
  email: string
  userId: string
}

const JWT_SECRET = new TextEncoder().encode('dev-secret')
const ACCESS_TOKEN_EXP = '5s'
const REFRESH_TOKEN_EXP = '7d'

export async function generateTokens(session: Session) {
  const accessToken = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXP)
    .sign(JWT_SECRET)

  const refreshToken = await new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXP)
    .sign(JWT_SECRET)

  return { accessToken, refreshToken }
}

export async function getAuthenticatedUserId() {
  const session = useSession.getState().session

  if (!session) {
    throw new Error('Not authenticated')
  }

  return {
    userId: session.userId,
  }
}
