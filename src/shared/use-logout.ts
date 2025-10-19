import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useSession } from '@/shared/use-session'
import { ROUTES } from '@/ui/router/routes'

export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useSession()
  const navigate = useNavigate()

  const handleLogout = async () => {
    queryClient.clear()
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return { handleLogout }
}
