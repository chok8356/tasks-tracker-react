export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'))
}

export function login(token: string) {
  localStorage.setItem('token', token)
}

export function logout() {
  localStorage.removeItem('token')
}
