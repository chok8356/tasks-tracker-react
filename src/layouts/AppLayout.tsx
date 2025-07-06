import { Link, Outlet } from 'react-router'

import { logout } from '@/router/auth'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav
        style={{
          borderRight: '1px solid gray',
          padding: '1rem',
          width: '200px',
        }}>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
