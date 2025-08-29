'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api' // 你的axios實例

export default function HomePage() {
  const [concerts, setConcerts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // 從後端concert API撈演唱會列表資料
  useEffect(() => {
    let cancel = false
    const fetchConcerts = async () => {
      setLoading(true)
      try {
        const res = await api.get('/concerts')
        if (!cancel) {
          setConcerts(res.data || [])
          setError(null)
        }
      } catch {
        if (!cancel) {
          setError('無法取得演唱會資料')
          setConcerts([])
        }
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    fetchConcerts()
    return () => { cancel = true }
  }, [])

  // 輪播自動切換
  useEffect(() => {
    if (concerts.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % concerts.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [concerts])

  // 跳至詳細頁可根據你的設計調整
  const handleCardClick = (concert) => {
    if (concert && concert.id) {
      router.push(`/info/${concert.id}`)
    }
  }
  const goToSlide = idx => setCurrentSlide(idx)
  const prevSlide = () => setCurrentSlide(s => concerts.length ? (s - 1 + concerts.length) % concerts.length : 0)
  const nextSlide = () => setCurrentSlide(s => concerts.length ? (s + 1) % concerts.length : 0)

  if (loading) {
    return (
      <main className="homepage-main-container flex items-center justify-center min-h-screen text-xl text-white">
        讀取資料中...
      </main>
    )
  }
  if (error) {
    return (
      <main className="homepage-main-container flex items-center justify-center min-h-screen text-xl text-red-400">
        {error}
      </main>
    )
  }
  if (!concerts.length) {
    return (
      <main className="homepage-main-container flex items-center justify-center min-h-screen text-xl text-gray-300">
        尚無演唱會資料
      </main>
    )
  }

  return (
    <main className="homepage-main-container">
      {/* 輪播 */}
      <section className="carousel-wrap">
        <button className="carousel-btn prev" onClick={prevSlide} aria-label="上一張輪播">&#8592;</button>
        <button className="carousel-btn next" onClick={nextSlide} aria-label="下一張輪播">&#8594;</button>
        {concerts.map((concert, idx) => (
          <div key={concert.id} className={`carousel-slide${idx === currentSlide ? ' active' : ''}`}>
            <img
              src={concert.image}
              alt={concert.title}
              draggable={false}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
        <div className="carousel-controls">
          {concerts.map((_, idx) => (
            <span
              key={idx}
              className={`carousel-dot${idx === currentSlide ? ' active' : ''}`}
              onClick={() => goToSlide(idx)}
              tabIndex={0}
            />
          ))}
        </div>
      </section>

      {/* 卡片區 */}
      <aside className="cards-wrap">
        {concerts.map(concert => (
          <div
            className="card"
            key={concert.id}
            tabIndex={0}
            onClick={() => handleCardClick(concert)}
            onKeyDown={e => e.key === 'Enter' && handleCardClick(concert)}
          >
            <img
              src={concert.image}
              alt={concert.title}
              draggable={false}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
            <div className="card-body">
              <div className="title">{concert.title}</div>
              {/* 舊版留 artist/date 有對應欄位可顯示 */}
              {/* <div className="date">日期：{concert.date}</div> */}
              {concert.artist && (
                <div className="artist text-sm opacity-70">藝人：{concert.artist}</div>
              )}
            </div>
          </div>
        ))}
      </aside>
    </main>
  )
}
