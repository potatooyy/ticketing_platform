import React from 'react'

export default function SeatMap({ tickets, selectedSeat, onSeatSelect }) {
  if (!tickets || tickets.length === 0) 
    return <div>尚無可選座位</div>

  // 分區分群
  const bySection = tickets.reduce((acc, t) => {
    const section = t.section || '未分區'
    if (!acc[section]) acc[section] = []
    acc[section].push(t)
    return acc
  }, {})

  return (
    <div style={{ width: '100%' }}>
      {Object.keys(bySection).sort().map(section => (
        <div key={section} style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>{section} 區</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {bySection[section].map(ticket => {
              const isSelected = selectedSeat === ticket.id
              const disabled = ticket.status !== 'available'
              return (
                <button
                  key={ticket.id}
                  disabled={disabled}
                  onClick={() => !disabled && onSeatSelect(ticket.id)}
                  style={{
                    minWidth: 42,
                    minHeight: 42,
                    margin: 2,
                    background: isSelected ? '#0070f3' : disabled ? '#eee' : '#fff',
                    color: isSelected ? '#fff' : '#333',
                    border: '1px solid #aaa',
                    borderRadius: 4,
                    cursor: disabled ? 'not-allowed' : 'pointer'
                  }}
                  aria-label={`座位 ${ticket.seat_number}，${disabled ? '不可選' : '可選'}`}
                >
                  {ticket.seat_number}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
