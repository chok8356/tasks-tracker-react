import { Navigate, Outlet, redirect } from 'react-router-dom'

import { useSession } from '@/shared/use-session'
import { ROUTES } from '@/ui/router/routes'

export const ProtectedRoute = () => {
  const { session } = useSession()

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <Outlet />
}

export async function protectedLoader() {
  const sessionState = useSession.getState()
  if (sessionState.token) {
    const { fakeFetch } = await import('@/infra/api/fake-fetch.ts')
    const accessToken = await sessionState.refreshToken(() =>
      fakeFetch.auth.refresh(),
    )
    if (!accessToken) {
      return redirect(ROUTES.LOGIN)
    }
    return null
  } else {
    return redirect(ROUTES.LOGIN)
  }
}
