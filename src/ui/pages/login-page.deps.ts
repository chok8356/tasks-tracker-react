import { err, ok } from 'neverthrow'

import { fakeFetch } from '@/infra/api/fake-fetch.ts'

import type { LoginPageProps } from './login-page'

export const loginPageDeps: LoginPageProps['deps'] = {
  login: async (req) => {
    try {
      const data = await fakeFetch.auth.login({
        email: req.email,
        password: req.password,
      })

      return ok({ token: data.accessToken })
    } catch (e) {
      if (e instanceof Error) {
        return err(e.message)
      }

      return err('An unexpected error occurred')
    }
  },
}
