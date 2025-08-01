// src/components/booking/SeatMap.js
export default function SeatMap({ concert, selectedSeat, onSeatSelect, disabledSeats = [] }) {
  // 可傳入已售/鎖定座位陣列, 供進階擴充
  const isDisabled = (seat) => disabledSeats && disabledSeats.includes(seat);

  const handleSeatClick = (seat) => {
    if (isDisabled(seat)) return;
    onSeatSelect(selectedSeat === seat ? null : seat);
  };

  return (
    <div className="seat-map mx-auto shadow-lg rounded-4">
      <div className="stage mb-3">舞台</div>
      {/* 動態區塊: 每一區一行 */}
      {Object.entries(concert.seatMap || {}).map(([zone, seats]) => (
        <div key={zone} className="zone mb-2" data-zone={zone}>
          {seats.map((seat) => (
            <button
              key={seat}
              type="button"
              className={`seat${selectedSeat === seat ? ' active' : ''}`}
              onClick={() => handleSeatClick(seat)}
              disabled={isDisabled(seat)}
              aria-pressed={selectedSeat === seat}
              aria-label={`${zone} 區 ${seat} 座位${selectedSeat === seat ? '，已選擇' : ''}${isDisabled(seat) ? '，不可選' : ''}`}
            >
              {seat}
            </button>
          ))}
        </div>
      ))}
      {/* 可選擇是否要 legend */}
      <div className="seatmap-legend mt-3 text-center small">
        <span className="seat"></span> 可選　
        <span className="seat active"></span> 已選　
        <span className="seat" disabled></span> 不可選
      </div>
    </div>
  );
}
