'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log('API Base URL:', apiBaseUrl);

export default function HomePage() {
  const router = useRouter()
  const [concerts, setConcerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchConcerts() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/concerts`)
        if (!res.ok) throw new Error('網路錯誤')
        const data = await res.json()
        setConcerts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchConcerts()
  }, [])

  const handleCardClick = (concert) => {
    router.push(`/info/${concert.id}`)
  }

  if (loading) return <p>載入中...</p>
  if (error) return <p>錯誤：{error}</p>

  return (
    <main className="homepage-main-container">
      <aside className="cards-wrap">
        {concerts.map(concert => (
          <div
            key={concert.id}
            className="card"
            tabIndex={0}
            onClick={() => handleCardClick(concert)}
            onKeyDown={e => e.key === 'Enter' && handleCardClick(concert)}
          >
            <img
              src={concert.image}
              alt={concert.title}
              draggable={false}
              loading="lazy"
            />
            <div className="card-body">
              <div className="title">{concert.title}</div>
              {/* 日期已移除 */}
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
