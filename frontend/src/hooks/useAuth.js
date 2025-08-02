// // src/hooks/useAuth.js
'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { logout as logoutUser } from '@/hooks/useAuthHelper'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

function useProvideAuth() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(user)

  const login = useCallback(async ({ username, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/token', { username, password })
      const { access, refresh } = res.data
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)

      setUser({ username }) // 你也可改成真實從後端撈的 user 資料

      setLoading(false)
      return { success: true }
    } catch (e) {
      setError('登入失敗，請確認帳號密碼')
      setUser(null)
      setLoading(false)
      return { success: false, error: '登入失敗，請確認帳號密碼' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    router.push('/login')
  }, [router])

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refreshToken')
      if (!refresh) throw new Error('沒有 refresh token')

      // 用 api.post會觸發互相攔截，可改用 fetch 或另建 axios 實例呼叫
      const res = await fetch('http://127.0.0.1:8000/api/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })

      if (!res.ok) throw new Error('刷新Token失敗')
      const data = await res.json()
      localStorage.setItem('accessToken', data.access)

      return true
    } catch (err) {
      logout()
      return false
    }
  }, [logout])

  // 初始化或刷新時，可從 token 資訊解析用戶或打user info API（此範例省略）
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setUser({ username: '已登入用戶' })
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  return { user, login, logout, refreshToken, isAuthenticated, loading, error }
}
