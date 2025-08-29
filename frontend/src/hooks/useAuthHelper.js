// src/hooks/useAuthHelper.js
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'  // 直接跳轉登入頁面
  }
}

export async function refreshToken() {
  if (typeof window === 'undefined') return false

  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false

  try {
    const res = await fetch(`${apiBaseUrl}/api/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!res.ok) throw new Error('刷新Token失敗')
    const data = await res.json()
    localStorage.setItem('accessToken', data.access)
    return true
  } catch (err) {
    logout()
    return false
  }
}
