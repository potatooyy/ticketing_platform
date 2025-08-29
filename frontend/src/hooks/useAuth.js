'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// --- 初始化 Context 與 Reducer ---
const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null }
    case 'LOGIN_ERROR':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  // --- 登入 ---
  const login = useCallback(async ({ username, password }) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const res = await fetch(`${apiBaseUrl}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) throw new Error('登入失敗，請確認帳號密碼')
      const { access, refresh } = await res.json()

      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)

      // 可選：打 user info API 來取得詳細資料
      const user = { username } // 假設只有帳號
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return { success: true }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message || '登入失敗' })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // --- 註冊 ---
  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      if (!userData.username?.trim()) throw new Error('請輸入使用者帳號')
      if (!userData.email?.trim()) throw new Error('請輸入電子郵件')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) throw new Error('電子郵件格式錯誤')
      if (!userData.password || userData.password.length < 6) throw new Error('密碼至少 6 字元')

      const response = await fetch(`${apiBaseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          gender: userData.gender,
          phone: userData.phone
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '註冊失敗')
      }

      const data = await response.json()
      // dispatch({ type: 'LOGIN_SUCCESS', payload: data })
      return { success: true, user: data }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message || '註冊失敗' })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // --- 登出 ---
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch({ type: 'LOGOUT' })
    router.push('/login')
  }, [router])

  // --- 刷新 Token ---
  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) return logout()

    try {
      const res = await fetch(`${apiBaseUrl}/api/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      })

      if (!res.ok) throw new Error('刷新 Token 失敗')
      const { access } = await res.json()
      localStorage.setItem('accessToken', access)
      return true
    } catch {
      logout()
      return false
    }
  }, [logout])

  // --- 初始化登入狀態 ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const savedUser = { username: '已登入用戶' }
      dispatch({ type: 'LOGIN_SUCCESS', payload: savedUser })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const contextValue = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),

    // 額外方便取值
    userName: state.user?.name || state.user?.username || '',
    userEmail: state.user?.email || '',
    isLoggedIn: state.isAuthenticated,
    hasError: !!state.error,
    isLoading: state.loading,
    isAdmin: state.user?.role === 'admin'
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
