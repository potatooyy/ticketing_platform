// src\app\page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { concertsData } from '@/data/concerts'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % concertsData.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = idx => setCurrentSlide(idx)
  const prevSlide = () => setCurrentSlide(s => (s - 1 + concertsData.length) % concertsData.length)
  const nextSlide = () => setCurrentSlide(s => (s + 1) % concertsData.length)
  const handleCardClick = concert => router.push(`/booking/${concert.id}`)

  return (
    <main className="homepage-main-container">
      <section className="carousel-wrap">
        <button className="carousel-btn prev" onClick={prevSlide} aria-label="上一張輪播">&#8592;</button>
        <button className="carousel-btn next" onClick={nextSlide} aria-label="下一張輪播">&#8594;</button>
        {concertsData.map((concert, idx) => (
          <div key={concert.id} className={`carousel-slide${idx === currentSlide ? ' active' : ''}`}>
            <img src={concert.image} alt={concert.title} draggable={false} loading="lazy" />
          </div>
        ))}
        <div className="carousel-controls">
          {concertsData.map((_, idx) => (
            <span key={idx} className={`carousel-dot${idx === currentSlide ? ' active' : ''}`} onClick={() => goToSlide(idx)} tabIndex={0} />
          ))}
        </div>
      </section>
      <aside className="cards-wrap">
        {concertsData.map(concert => (
          <div className="card" key={concert.id} tabIndex={0} onClick={() => handleCardClick(concert)}
            onKeyDown={e => e.key === 'Enter' && handleCardClick(concert)}>
            <img src={concert.image} alt={concert.title} draggable={false} loading="lazy" />
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
