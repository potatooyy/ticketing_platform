'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { user, loading, logout, isLoggedIn } = useAuth() || {}
  const isLogin = !!(user && (isLoggedIn === undefined ? true : isLoggedIn))

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/search?keyword=${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  const handleMemberClick = () => {
    if (loading) return
    if (isLogin) {
      router.push('/tickets')
    } else {
      router.push('/login')
    }
    setMenuOpen(false)
  }

  const handleCartClick = () => {
    router.push('/cart')
    setMenuOpen(false)
  }

  const handleLogout = () => {
    try {
      if (logout && typeof logout === 'function') {
        logout()
        router.push('/')
      }
    } catch (error) {
      console.error('登出錯誤:', error)
      router.push('/')
    }
    setMenuOpen(false)
  }

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  }

  const toggleMenu = () => setMenuOpen(open => !open)

  return (
    <header className="tixgo-header" role="banner">
      <div className="header-container">
        <Link href="/" className="header-logo" aria-label="TixGo 首頁" onClick={() => setMenuOpen(false)}>
          <span className="dot" aria-hidden="true"></span>
          TixGo
        </Link>

        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          onKeyDown={e => handleKeyDown(e, toggleMenu)}
          type="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`header-right ${menuOpen ? 'open' : ''}`}>
          <nav className="nav-links" role="navigation" aria-label="主要導航">
            <Link href="/" onClick={() => setMenuOpen(false)} aria-label="首頁">首頁</Link>
            <Link href="/concerts" onClick={() => setMenuOpen(false)} aria-label="商品列表">商品列表</Link>
          </nav>

          <div className="header-icons" role="toolbar" aria-label="用戶操作">
            <div
              className="icon-btn"
              title={user ? `${user.name || user.email} - 點擊查看票券` : '會員登入'}
              onClick={handleMemberClick}
              onKeyDown={e => handleKeyDown(e, handleMemberClick)}
              role="button"
              tabIndex={0}
              aria-label={isLogin ? '查看票券' : '會員登入'}
              aria-pressed={loading ? 'mixed' : 'false'}
            >
              {loading ? (
                <i className="bi bi-arrow-repeat loading" aria-hidden="true"></i>
              ) : (
                <i className="bi bi-person" aria-hidden="true"></i>
              )}
            </div>

            <div
              className="icon-btn"
              title="購物車"
              onClick={handleCartClick}
              onKeyDown={e => handleKeyDown(e, handleCartClick)}
              role="button"
              tabIndex={0}
              aria-label="購物車"
            >
              <i className="bi bi-cart3" aria-hidden="true"></i>
            </div>

            {isLogin && (
              <div
                className="icon-btn"
                title="登出"
                onClick={handleLogout}
                onKeyDown={e => handleKeyDown(e, handleLogout)}
                role="button"
                tabIndex={0}
                aria-label="登出"
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
              </div>
            )}
          </div>

          <form
            className="header-search"
            onSubmit={handleSearch}
            role="search"
            aria-label="搜尋演唱會"
          >
            <input
              type="text"
              placeholder="搜尋演唱會、藝人或場館..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
              aria-label="搜尋演唱會"
              maxLength={50}
            />
            <button
              type="submit"
              aria-label="執行搜尋"
              disabled={!searchQuery.trim()}
            >
              <i className="bi bi-search" aria-hidden="true"></i>
            </button>
          </form>
        </div>

        {user && (
          <div className="mobile-user-info d-block d-md-none mt-2">
            <small className="text-light">
              <i className="bi bi-person-check me-1"></i>
              歡迎, {user.name || user.email}
            </small>
          </div>
        )}
      </div>

      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>}
    </header>
  )
}
