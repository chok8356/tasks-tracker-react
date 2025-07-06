import { Navigate, Outlet } from 'react-router'

import { isAuthenticated } from './auth'

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }
  return <Outlet />
}
