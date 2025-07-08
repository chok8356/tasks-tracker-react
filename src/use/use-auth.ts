import { useEffect, useState } from 'react'

export function useAuth() {
  const [isAuth, setIsAuth] = useState(() =>
    Boolean(localStorage.getItem('token')),
  )

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuth(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuth(false)
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(Boolean(localStorage.getItem('token')))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { isAuthenticated: isAuth, login, logout }
}
