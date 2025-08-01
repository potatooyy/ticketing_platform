// src/app/page.js
'use client'
import { useRouter } from 'next/navigation'
import { concertsData } from '@/data/concerts'

export default function HomePage() {
  const router = useRouter()

  const handleCardClick = concert => router.push(`/info/`)
  
// ${concert.id}
  return (
    <main className="homepage-main-container">
      <aside className="cards-wrap">
        {concertsData.map(concert => (
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
            />
            <div className="card-body">
              <div className="title">{concert.title}</div>
              <div className="date">日期：{concert.date}</div>
            </div>
          </div>
        ))}
      </aside>
    </main>
  )
}
