import { Outlet, useNavigate } from 'react-router'

import { Menu } from '@/layouts/components/menu'
import { useAuth } from '@/use/use-auth'

export const AppLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-base-200 grid h-full grid-rows-[1fr_auto] p-2">
        <Menu></Menu>

        <ul className="menu">
          <li>
            <span
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="tooltip tooltip-right"
              data-tip="Logout">
              Logout
            </span>
          </li>
        </ul>
      </div>

      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
