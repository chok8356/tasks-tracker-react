import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/use/use-auth'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }
  return <Outlet />
}
