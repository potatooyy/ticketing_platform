// src/app/auth/register/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await register(formData)
      if (result.success) {
        alert('註冊成功！即將跳轉至首頁')
        router.push('/')
      } else {
        setError(result.error || '註冊失敗，請稍後再試')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-wrapper">
      <div className="auth-toggle">
        <Link href="/login" className="tab">登入</Link>
        <span className="tab active">會員註冊表單</span>
      </div>
      <h2 className="auth-title">會員註冊表單</h2>
      <p className="auth-subtitle">請填寫以下資訊以註冊新帳號</p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <label htmlFor="name">姓名</label>
        <input id="name" name="name" type="text" placeholder="請輸入您的姓名" value={formData.name}
          onChange={handleChange} autoComplete="name" required />
        <label htmlFor="email">電子郵件</label>
        <input id="email" name="email" type="email" placeholder="請輸入您的電子郵件"
          value={formData.email} onChange={handleChange} autoComplete="email" required />
        <label htmlFor="password">密碼</label>
        <input id="password" name="password" type="password" placeholder="請輸入您的密碼"
          value={formData.password} onChange={handleChange} autoComplete="new-password" required />
        <label>性別</label>
        <div className="auth-gender">
          {['male', 'female', 'other'].map((value, idx) => (
            <label key={value} className="gender-label">
              <input className="auth-radio" type="radio" name="gender" value={value}
                checked={formData.gender === value} onChange={handleChange} required />
              <span>{['男', '女', '其他'][idx]}</span>
            </label>
          ))}
        </div>
        <label htmlFor="phone">電話號碼</label>
        <input id="phone" name="phone" type="tel" placeholder="請輸入您的電話號碼"
          value={formData.phone} onChange={handleChange} pattern="09\d{8}" title="請輸入正確手機格式 09xxxxxxxx"
          autoComplete="tel" required />
        <div className="auth-buttons single">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '註冊中...' : '提交註冊'}</button>
        </div>
      </form>
    </main>
  )
}
