// src/app/auth/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
    const result = await login(formData)
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
        <label htmlFor="email">電子郵件</label>
        <input id="email" name="email" type="email" placeholder="請輸入您的電子郵件"
          value={formData.email} onChange={handleChange} required autoComplete="email" />
        <label htmlFor="password">密碼</label>
        <input id="password" name="password" type="password" placeholder="請輸入您的密碼"
          value={formData.password} onChange={handleChange} required autoComplete="current-password" />
        <div className="auth-buttons">
          <Link href="/register" className="btn-outline">註冊新帳戶</Link>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '登入中...' : '登入'}</button>
        </div>
      </form>
    </main>
  )
}
