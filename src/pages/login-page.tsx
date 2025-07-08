import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { LoginForm } from '@/components/login-form.tsx'
import { useAuth } from '@/use/use-auth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  })

  function handleLogin() {
    login('fake-token')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="d-grid min-h-screen w-screen content-center p-12">
      <LoginForm
        onLogin={handleLogin}
        className="m-auto w-sm"></LoginForm>
    </div>
  )
}
