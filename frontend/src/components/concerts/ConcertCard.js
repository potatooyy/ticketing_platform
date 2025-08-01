// src\components\concerts\ConcertCard.js
import Image from 'next/image'
export default function ConcertCard({ concert, onClick }) {
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(concert)
    }
  }
  return (
    <div className="concert-card"
      onClick={() => onClick && onClick(concert)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`查看演唱會：${concert.title}`}>
      <div className="card-img-wrapper">
        <Image src={concert.image} alt={concert.title} width={300} height={400} className="card-img-top"
          style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" draggable={false} />
      </div>
      <div className="card-body">
        <div className="card-title">{concert.title}</div>
        <div className="card-date">日期：{concert.date}</div>
        {concert.venue && (
          <div className="card-venue text-muted small">地點：{concert.venue}</div>
        )}
      </div>
    </div>
  )
}
