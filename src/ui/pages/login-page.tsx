import type { Result } from 'neverthrow'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useSession } from '@/shared/use-session'
import { ROUTES } from '@/ui/router/routes'
import { LoginForm } from '@/ui/shadcn/components/login-form'

export type LoginPageProps = {
  deps: {
    login: (req: {
      email: string
      password: string
    }) => Promise<Result<{ token: string }, ErrorMessage>>
  }
}

export const LoginPage = ({ deps }: LoginPageProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { login: sessionLogin } = useSession()
  const [error, setError] = useState<ErrorMessage | null>(null)

  async function handleLogin(email: string, password: string) {
    const result = await deps.login({ email, password })

    result.match(
      async (value) => {
        queryClient.clear()
        sessionLogin(value.token)
        navigate(ROUTES.HOME, { replace: true })
      },
      (error) => {
        setError(error)
      },
    )
  }

  return (
    <div className="d-grid min-h-screen w-screen content-center p-12">
      <LoginForm
        className="m-auto w-sm"
        error={error}
        onLogin={handleLogin}></LoginForm>
    </div>
  )
}
