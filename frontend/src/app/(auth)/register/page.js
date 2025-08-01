'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
  })

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
    setError('')

    // 簡單的確認密碼驗證
    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不一致')
      return
    }

    setLoading(true)
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

        <label htmlFor="username">使用者帳號 (username)</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="請輸入使用者帳號"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">電子郵件</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="請輸入您的電子郵件"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label htmlFor="password">密碼</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="請輸入您的密碼"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirmPassword">確認密碼</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="請再次輸入您的密碼"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <label htmlFor="firstName">名字 (first name)</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="請輸入您的名字"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">姓氏 (last name)</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="請輸入您的姓氏"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>性別</label>
        <div className="auth-gender">
          {['male', 'female', 'undisclosed'].map((value, idx) => (
            <label key={value} className="gender-label">
              <input
                className="auth-radio"
                type="radio"
                name="gender"
                value={value}
                checked={formData.gender === value}
                onChange={handleChange}
                required
              />
              <span>{['男', '女', '其他'][idx]}</span>
            </label>
          ))}
        </div>

        {/* <label htmlFor="phone">電話號碼</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="請輸入您的電話號碼"
          value={formData.phone}
          onChange={handleChange}
          pattern="09\d{8}"
          title="請輸入正確手機格式 09xxxxxxxx"
          autoComplete="tel"
          required
        /> */}

        <div className="auth-buttons single">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '註冊中...' : '提交註冊'}
          </button>
        </div>
      </form>
    </main>
  )
}
