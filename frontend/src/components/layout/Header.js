'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false) // 漢堡選單狀態
  const router = useRouter()
  const { user, loading, logout, isLoggedIn } = useAuth() || {}

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/search?keyword=${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery('')
      setMenuOpen(false) // 搜尋後關閉選單（手機）
    }
  }

  const handleMemberClick = () => {
    if (loading) return
    if (user && isLoggedIn) {
      router.push('/tickets')
    } else {
      router.push('/login')
    }
    setMenuOpen(false) // 關閉選單
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

  // 漢堡選單切換
  const toggleMenu = () => setMenuOpen((open) => !open)

  return (
    <header className="tixgo-header" role="banner">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="header-logo" aria-label="TixGo 首頁" onClick={() => setMenuOpen(false)}>
          <span className="dot" aria-hidden="true"></span>
          TixGo
        </Link>

        {/* 漢堡選單按鈕 (手機顯示) */}
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
          type="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* 右側區域 */}
        <div className={`header-right ${menuOpen ? 'open' : ''}`}>
          {/* 主要導航 */}
          <nav className="nav-links" role="navigation" aria-label="主要導航">
            <Link href="/" onClick={() => setMenuOpen(false)} aria-label="首頁">首頁</Link>
            <Link href="/concerts" onClick={() => setMenuOpen(false)} aria-label="商品列表">商品列表</Link>
          </nav>

          {/* 用戶操作工具列 */}
          <div className="header-icons" role="toolbar" aria-label="用戶操作">
            {/* 會員按鈕 */}
            <div
              className="icon-btn"
              title={user ? `${user.name || user.email} - 點擊查看票券` : '會員登入'}
              onClick={handleMemberClick}
              onKeyDown={e => handleKeyDown(e, handleMemberClick)}
              role="button"
              tabIndex={0}
              aria-label={user ? '查看票券匣' : '會員登入'}
              aria-pressed={loading ? 'mixed' : 'false'}
            >
              {loading ? (
                <i className="bi bi-arrow-repeat loading" aria-hidden="true"></i>
              ) : (
                <i className="bi bi-person" aria-hidden="true"></i>
              )}
            </div>

            {/* 購物車按鈕 */}
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

            {/* 登出按鈕（已登入時才顯示） */}
            {user && isLoggedIn && (
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
            {/* 管理後台按鈕（不做登入判斷，永遠顯示） */}
            <div
              className="icon-btn"
              title="管理後台"
              onClick={() => window.location.href = 'http://127.0.0.1:8000/admin'}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.href = 'http://127.0.0.1:8000/admin'
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="管理後台"
            >
              <i className="bi bi-gear" aria-hidden="true"></i>
            </div>
          </div>

          {/* 搜尋表單 */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* 手機版已登入用戶名稱提示 */}
        {user && (
          <div className="mobile-user-info d-block d-md-none mt-2">
            <small className="text-light">
              <i className="bi bi-person-check me-1"></i>
              歡迎, {user.name || user.email}
            </small>
          </div>
        )}
      </div>

      {/* 漢堡選單展開時覆蓋層 */}
      {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>}

      <style jsx>{`
        /* 漢堡按鈕樣式 */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 1rem;
          z-index: 20;
        }
        .hamburger-btn .bar {
          display: block;
          width: 100%;
          height: 3px;
          background-color: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger-btn.open .bar:nth-child(1) {
          transform: translateY(8.5px) rotate(45deg);
        }
        .hamburger-btn.open .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger-btn.open .bar:nth-child(3) {
          transform: translateY(-8.5px) rotate(-45deg);
        }

        /* 響應式 - 螢幕小於600px 顯示漢堡，隱藏原本右側內容 */
        @media (max-width: 600px) {
          .hamburger-btn {
            display: flex;
          }
          .header-right {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 240px;
            background-color: #222;
            color: #fff;
            flex-direction: column;
            padding: 2rem 1rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 15;
            overflow-y: auto;
          }
          .header-right.open {
            transform: translateX(0);
          }
          .nav-links {
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .nav-links a {
            color: #fff;
            font-weight: 600;
            font-size: 1.2rem;
          }
          .header-icons {
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .header-search {
            width: 100%;
          }
          /* 遮罩層 */
          .menu-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 10;
          }
        }
      `}</style>
    </header>
  )
}
