// src\components\concerts\ConcertCarousel.js
'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function ConcertCarousel({ concerts }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const nextSlide = useCallback(() => setCurrentSlide(prev => (prev + 1) % concerts.length), [concerts.length])
  const prevSlide = useCallback(() => setCurrentSlide(prev => (prev - 1 + concerts.length) % concerts.length), [concerts.length])
  const goToSlide = useCallback((index) => setCurrentSlide(index), [])

  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide, isAutoPlay])

  const handleDotKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToSlide(index)
    }
  }

  return (
    <div className="carousel-container"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="carousel-slides">
        {concerts.map((concert, index) => (
          <div key={concert.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            aria-hidden={index !== currentSlide} role="group" aria-label={concert.title}>
            <Image src={concert.image} alt={concert.title} fill style={{ objectFit: 'cover' }} priority={index === currentSlide} draggable={false} />
          </div>
        ))}
      </div>
      <button className="carousel-btn prev" onClick={prevSlide} aria-label="上一張" type="button">&#8592;</button>
      <button className="carousel-btn next" onClick={nextSlide} aria-label="下一張" type="button">&#8594;</button>
      <div className="carousel-controls" role="tablist" aria-label="輪播導航點">
        {concerts.map((_, index) => (
          <button key={index} className={`carousel-dot${index === currentSlide ? ' active' : ''}`}
            onClick={() => goToSlide(index)} onKeyDown={(e) => handleDotKeyDown(e, index)}
            aria-selected={index === currentSlide} role="tab" tabIndex={index === currentSlide ? 0 : -1} type="button"
            aria-label={`切換至第 ${index + 1} 張`} />
        ))}
      </div>
    </div>
  )
}
