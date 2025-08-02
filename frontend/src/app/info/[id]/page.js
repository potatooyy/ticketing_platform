'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InfoPage({ params }) {
  const { id } = params
  const router = useRouter()
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchShow() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/shows/${id}`)
        if (!res.ok) throw new Error('找不到該演出資料')
        const data = await res.json()
        setShow(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchShow()
  }, [id])

  const handleBookingClick = () => {
    // 假設跳轉到 /booking/:concertId
    if (show && show.concert) {
      router.push(`/booking/${show.concert.id}`)
    }
  }

  if (loading) return <p>載入中...</p>
  if (error) return <p>錯誤：{error}</p>
  if (!show) return null

  const { concert, venue, show_date, show_time } = show

  // return (
  //   <main className="info-page-container" style={{ padding: '1rem' }}>
  //     <h1>{concert.title}</h1>
  //     <img className="hero-img" src={concert.image} alt={concert.title} style={{ maxWidth: '400px', userSelect: 'none' }} />
  //     <p><strong>藝人:</strong> {concert.artist}</p>
  //     <p><strong>描述:</strong> {concert.description}</p>
  //     <p><strong>場地:</strong> {venue.name} ({venue.address})</p>
  //     <p><strong>演出日期:</strong> {show_date}</p>
  //     <p><strong>演出時間:</strong> {show_time}</p>

  //     <button 
  //       className="btn btn-danger"
  //       onClick={handleBookingClick}
  //       style={{ marginTop: '1rem' }}
  //     >
  //       立即購票
  //     </button>
  //   </main>
  // )


  return (
    <>
      <img className="hero-img" src={concert.image} alt={concert.title} style={{ maxWidth: '1800px', userSelect: 'none' }} />
      <div className="banner-bar">
          <button className="btn btn-danger" onClick={handleBookingClick}>
            立即購票
          </button>
          <br />
          <br />
        <div className="banner-title">{concert.title}</div>
        <div className="banner-desc"><strong>藝人:</strong> {concert.artist}</div>
        <div className="banner-desc">{concert.description}</div>
        <div className="banner-desc"><strong>場地:</strong> {venue.name} ({venue.address})</div>
        <div className="banner-desc"><strong>演出日期:</strong> {show_date}</div>
        <div className="banner-desc"><strong>演出時間:</strong> {show_time}</div>
        <div className="banner-btns">
          {/* <button className="btn btn-outline-light" onClick={handleAddToCart}>
            加入購物車
          </button> */}
        </div>
      </div>
      {/* <div className="cards-carousel-wrap">
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
      </div> */}
    </>
  )
}
