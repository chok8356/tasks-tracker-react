import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@/use/useAuth'

export default function ProtectedRoute() {
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
