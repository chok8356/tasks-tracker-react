import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

type Session = {
  email: string
  exp: number
  iat: number
  userId: string
}

type State = {
  login: (token: string) => void
  logout: () => void
  refreshToken: (
    refreshApiCall: () => Promise<{ accessToken?: null | string }>,
  ) => Promise<null | string>
  session: null | Session
  token: null | string
}

const TOKEN_KEY = 'token'

let refreshTokenPromise: null | Promise<null | string> = null

const readInitialToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

export const useSession = create<State>((set, get) => {
  const initialToken = readInitialToken()

  return {
    login: (token: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token)
      }
      set({ session: jwtDecode<Session>(token), token })
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
      }
      set({ session: null, token: null })
    },

    refreshToken: async (
      refreshApiCall: () => Promise<{ accessToken?: null | string }>,
    ) => {
      const token = get().token
      if (!token) return null

      const current = jwtDecode<Session>(token)
      const isExpired = current.exp < Date.now() / 1000

      if (!isExpired) {
        return token
      }

      if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
          try {
            const response = await refreshApiCall()
            const newToken = response.accessToken ?? null

            if (newToken) {
              get().login(newToken)
              return newToken
            } else {
              get().logout()
              return null
            }
          } catch {
            get().logout()
            return null
          } finally {
            refreshTokenPromise = null
          }
        })()
      }

      return await refreshTokenPromise
    },

    session: initialToken ? jwtDecode<Session>(initialToken) : null,

    token: initialToken,
  }
})
