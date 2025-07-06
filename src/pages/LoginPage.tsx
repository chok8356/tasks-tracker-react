import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { isAuthenticated, login } from '@/router/auth'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  })

  function handleLogin() {
    login('fake-token')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={{ margin: 'auto', maxWidth: 300, padding: '2rem' }}>
      <h2>Login</h2>
      <button
        type="button"
        onClick={handleLogin}>
        Войти
      </button>
    </div>
  )
}
