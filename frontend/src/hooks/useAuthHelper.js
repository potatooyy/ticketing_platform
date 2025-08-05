// src/hooks/useAuthHelper.js

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
    const res = await fetch('http://127.0.0.1:8000/api/token/refresh', {
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
