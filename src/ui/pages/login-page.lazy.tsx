import { LoginPage } from '@/ui/pages/login-page'
import { loginPageDeps } from '@/ui/pages/login-page.deps'

export const loginLazyLoader = async () => {
  return { Component: () => <LoginPage deps={loginPageDeps} /> }
}
