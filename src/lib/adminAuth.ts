const ADMIN_SESSION_KEY = 'wedyora-admin'
const ADMIN_USER_KEY = 'wedyora-admin-user'

/** Demo admin credentials — replace with Supabase Auth later. */
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Wedyora@Admin1',
} as const

export function loginAdmin(username: string, password: string): boolean {
  const u = username.trim().toLowerCase()
  const p = password
  if (u !== ADMIN_CREDENTIALS.username || p !== ADMIN_CREDENTIALS.password) return false
  sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
  sessionStorage.setItem(ADMIN_USER_KEY, ADMIN_CREDENTIALS.username)
  return true
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
  sessionStorage.removeItem(ADMIN_USER_KEY)
}

export function isAdminLoggedIn(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
}

export function getAdminUsername(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(ADMIN_USER_KEY)
}
