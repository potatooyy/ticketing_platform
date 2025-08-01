// src/hooks/useAuth.js
'use client'
import { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true, // 先設為 true，待初始化完成
    error: null
  })

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === 'undefined') return

        const savedUser = localStorage.getItem('tixgo_user')
        if (savedUser) {
          const user = JSON.parse(savedUser)

          // 簡單資料驗證
          if (user && typeof user === 'object' && user.id && (user.email || user.name) && user.loginTime) {
            // 檢查登入是否過期（30天）
            const loginTime = new Date(user.loginTime)
            const now = new Date()
            const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24)
            if (daysDiff > 30) {
              localStorage.removeItem('tixgo_user')
              dispatch({ type: 'SET_LOADING', payload: false })
            } else {
              dispatch({ type: 'LOGIN_SUCCESS', payload: user })
            }
          } else {
            localStorage.removeItem('tixgo_user')
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('初始化認證狀態失敗:', error)
        try {
          localStorage.removeItem('tixgo_user')
        } catch {
          // 清理失敗略過
        }
        dispatch({ type: 'LOGIN_ERROR', payload: '用戶資料損壞，請重新登入' })
      }
    }

    initializeAuth()
  }, [])

  // 電子郵件格式驗證
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 模擬登入 API
  const mockLoginAPI = (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@tixgo.com') {
          resolve({
            id: 1,
            email: credentials.email,
            name: '管理員',
            role: 'admin'
          })
        } else if (credentials.password === 'wrongpassword') {
          reject(new Error('密碼錯誤'))
        } else {
          resolve({
            id: Math.floor(Math.random() * 1000) + 100,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'user'
          })
        }
      }, 1200)
    })
  }

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('請填寫完整的登入資訊')
      }

      if (!isValidEmail(credentials.email)) {
        throw new Error('請輸入有效的電子郵件地址')
      }

      if (credentials.password.length < 6) {
        throw new Error('密碼長度至少需要6個字元')
      }

      const user = await mockLoginAPI(credentials)
      const userWithTimestamp = {
        ...user,
        loginTime: new Date().toISOString()
      }
      localStorage.setItem('tixgo_user', JSON.stringify(userWithTimestamp))
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithTimestamp })

      return { success: true, user: userWithTimestamp }
    } catch (error) {
      const errorMessage = error.message || '登入失敗，請檢查網路連線後重試'
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // 註冊資料驗證
  function validateRegistrationData(userData) {
    const { name, email, password, phone } = userData
    if (!name?.trim()) return { isValid: false, error: '請輸入姓名' }
    if (!email?.trim()) return { isValid: false, error: '請輸入電子郵件' }
    if (!isValidEmail(email)) return { isValid: false, error: '請輸入有效的電子郵件地址' }
    if (!password) return { isValid: false, error: '請輸入密碼' }
    if (password.length < 6) return { isValid: false, error: '密碼長度至少需要6個字元' }
    if (!phone?.trim()) return { isValid: false, error: '請輸入電話號碼' }
    return { isValid: true }
  }

  // 模擬註冊 API
  const mockRegisterAPI = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email === 'existing@example.com') {
          reject(new Error('此電子郵件已被註冊'))
        } else {
          resolve({
            id: Math.floor(Math.random() * 1000) + 1000,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: 'user'
          })
        }
      }, 1500)
    })
  }

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const validation = validateRegistrationData(userData)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const user = await mockRegisterAPI(userData)
      const userWithTimestamp = {
        ...user,
        loginTime: new Date().toISOString()
      }
      localStorage.setItem('tixgo_user', JSON.stringify(userWithTimestamp))
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithTimestamp })

      return { success: true, user: userWithTimestamp }
    } catch (error) {
      const errorMessage = error.message || '註冊失敗，請稍後再試'
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('tixgo_user')
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('登出時發生錯誤:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    login,
    register,
    logout,
    clearError,

    userName: state.user?.name || state.user?.email || '',
    userEmail: state.user?.email || '',
    isLoggedIn: state.isAuthenticated && !!state.user,
    hasError: !!state.error,
    isLoading: state.loading,
    isAdmin: state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.error('useAuth must be used within AuthProvider')

    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async () => ({ success: false, error: 'Auth context not initialized' }),
      register: async () => ({ success: false, error: 'Auth context not initialized' }),
      logout: () => console.warn('Auth context not available'),
      clearError: () => {},
      userName: '',
      userEmail: '',
      isLoggedIn: false,
      hasError: false,
      isLoading: false,
      isAdmin: false
    }
  }
  return context
}
 