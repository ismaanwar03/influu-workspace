export function setAuthCookies(name: string, role: string) {
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  document.cookie = `user_name=${name}; path=/; expires=${expires.toUTCString()}`
  document.cookie = `user_role=${role}; path=/; expires=${expires.toUTCString()}`
}

export function getAuthCookies(): { name: string; role: string } | null {
  if (typeof document === 'undefined') return null
  const cookies = Object.fromEntries(
    document.cookie
      .split('; ')
      .filter(Boolean)
      .map((c) => c.split('=')),
  )
  if (!cookies.user_name || !cookies.user_role) return null
  return { name: cookies.user_name, role: cookies.user_role }
}

export function clearAuthCookies() {
  document.cookie = 'user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
