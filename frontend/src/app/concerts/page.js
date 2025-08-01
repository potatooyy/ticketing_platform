// src/app/concerts/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { concertsData } from '@/data/concerts'

export default function ConcertsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + concertsData.length) % concertsData.length)
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % concertsData.length)
  const handleConcertClick = (concert) => router.push(`/booking/${concert.id}`)
  const handleBookingClick = () => {
    if (concertsData.length > 0) {
      router.push(`/booking/${concertsData[0].id}`)
    }
  }
  const visibleConcerts = []
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % concertsData.length
    visibleConcerts.push(concertsData[index])
  }

  return (
    <>
      <img className="hero-img" src="/img/蔡依林 Ugly Beauty 2.0 世界巡演.jpg" alt="主視覺" />
      <div className="banner-bar">
        <div className="banner-title">獲取你的演唱會票！</div>
        <div className="banner-desc">探索即將來臨的演唱會活動並搶先購票！</div>
        <div className="banner-btns">
          <button className="btn btn-outline-light">查看過去活動</button>
          <button className="btn btn-danger" onClick={handleBookingClick}>立即購票</button>
        </div>
      </div>
      <div className="cards-carousel-wrap">
        <button className="carousel-arrow" onClick={handlePrevious}>&#60;</button>
        <div className="cards-wrap">
          {visibleConcerts.map((concert) => (
            <div key={concert.id} className="card"
              onClick={() => handleConcertClick(concert)} tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleConcertClick(concert)}
              role="button" aria-label={`選擇演唱會 ${concert.title}`}>
              <img src={concert.image} alt={concert.title} draggable={false} />
              <div className="card-body">
                <div className="title">{concert.title}</div>
                <div className="date">日期：{concert.date}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow" onClick={handleNext}>&#62;</button>
      </div>
    </>
  )
}
