'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  // 前端狀態維持 username, password
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // login 時以 username 傳遞
    const result = await login({ 
      username: formData.username, 
      password: formData.password 
    })

    if (result.success) {
      const redirectPath = sessionStorage.getItem('redirect_after_login')
      if (redirectPath) {
        sessionStorage.removeItem('redirect_after_login')
        router.push(redirectPath)
      } else {
        router.push('/')
      }
    } else {
      setError(result.error || '登入失敗，請檢查帳號密碼')
    }
    setLoading(false)
  }

  return (
    <main className="auth-wrapper">
      <div className="auth-toggle">
        <span className="tab active">登入</span>
        <Link href="/register" className="tab">會員註冊表單</Link>
      </div>
      <h2 className="auth-title">登入</h2>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <label htmlFor="username">帳號</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="請輸入您的帳號"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        <label htmlFor="password">密碼</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="請輸入您的密碼"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <div className="auth-buttons">
          <Link href="/register" className="btn-outline">註冊新帳戶</Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </button>
        </div>
      </form>
    </main>
  )
}
