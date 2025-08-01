// src/components/layout/Header.js
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, loading, logout, isLoggedIn } = useAuth() || {}

  /**
   * 搜尋表單提交處理，跳轉至 /search?keyword=xxx
   */
  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      router.push(`/search?keyword=${encodeURIComponent(trimmedQuery)}`)
      setSearchQuery('')
    }
  }

  /**
   * 會員 icon 點擊行為：
   * - 載入中不做任何行動
   * - 已登入導向 /tickets
   * - 未登入導向 /login
   */
  const handleMemberClick = () => {
    if (loading) return
    if (user && isLoggedIn) {
      router.push('/tickets')
    } else {
      router.push('/login')
    }
  }

  /**
   * 購物車 icon 點擊，目前展示提示（可後續擴充）
   */
  const handleCartClick = () => {
    alert('🛒 購物車功能即將推出，敬請期待！')
  }

  /**
   * 登出按鈕行為
   */
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
  }

  /**
   * 鍵盤操作回調
   */
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      callback()
    }
  }

  return (
    <header className="tixgo-header" role="banner">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="header-logo" aria-label="TixGo 首頁">
          <span className="dot" aria-hidden="true"></span>
          TixGo
        </Link>

        {/* 右側區域 - 導航連結、操作icon、搜尋 */}
        <div className="header-right">
          {/* 主要導航 */}
          <nav className="nav-links" role="navigation" aria-label="主要導航">
            <Link href="/" aria-label="首頁">首頁</Link>
            <Link href="/concerts" aria-label="商品列表">商品列表</Link>
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
    </header>
  )
}

