// // src\app\tickets\page.js
// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/hooks/useAuth'

// const handleConcertClick = (concert) => router.push(`/booking/${concert.id}`)
//   const handleBookingClick = () => {
//     if (concertsData.length > 0) {
//       router.push(`/booking/${currentConcert.id}`)
//     }
//   }
// export default function TicketsPage() {
//   const [tickets, setTickets] = useState([])
//   const { user, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login')
//       return
//     }
//     if (user) {
//       setTickets([
//         {
//           id: 1,
//           concertName: "周杰倫 2025 世界巡迴演唱會",
//           show: "20250801",
//           seat: "C2",
//           date: "2025-09-18",
//           venue: "桃園國際棒球場",
//           price: 1000
//         },
//         {
//           id: 2,
//           concertName: "林俊傑 JJ20 演唱會",
//           show: "20250801",
//           seat: "C3",
//           date: "2025-09-18",
//           venue: "高雄巨蛋",
//           price: 1000
//         }
//       ])
//     }
//   }, [user, loading, router])

//   if (loading) return <div className="text-center py-5">載入中...</div>
//   const totalPrice = tickets.reduce((sum, ticket) => sum + ticket.price, 0)
//   const formatShowDate = (dateStr) => (dateStr || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')

//   return (
//     <main className="ticket-main-bg">
//       <div className="ticket-title">票券匣</div>
//       <div className="ticket-card">
//         <table className="ticket-table">
//           <thead>
//             <tr>
//               <th>演唱會名稱</th>
//               <th>場次</th>
//               <th>座位</th>
//               <th>時間</th>
//               <th>地點</th>
//               <th>價格</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((ticket) => (
//               <tr key={ticket.id}>
//                 <td>{ticket.concertName}</td>
//                 <td>{formatShowDate(ticket.show)}</td>
//                 <td>{ticket.seat}</td>
//                 <td>{ticket.date}</td>
//                 <td>{ticket.venue}</td>
//                 <td className="price">{ticket.price} 元</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="ticket-total" aria-label="票券總價">
//           總價 <span className="total-price">$ {totalPrice} 元</span>
//         </div>
//         <div className="banner-btns">
//           {/* <button className="btn btn-outline-light">查看過去活動</button> */}
//           <button className="btn btn-danger" onClick={handleBookingClick}>立即付款</button>
//         </div>
//       </div>
//     </main>
//   )
// }
// src/app/tickets/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (user) {
      setTickets([
        {
          id: 1,
          concertId: '1',  // 對應演唱會的 id
          concertName: "周杰倫 2025 世界巡迴演唱會",
          show: "20250801",
          seat: "C2",
          date: "2025-09-18",
          venue: "桃園國際棒球場",
          price: 1000
        },
        {
          id: 2,
          concertId: '2',  // 對應演唱會的 id
          concertName: "林俊傑 JJ20 演唱會",
          show: "20250801",
          seat: "C3",
          date: "2025-09-18",
          venue: "高雄巨蛋",
          price: 1000
        }
      ])
    }
  }, [user, loading, router])

  if (loading) return <div className="text-center py-5">載入中...</div>

  const totalPrice = tickets.reduce((sum, ticket) => sum + ticket.price, 0)
  const formatShowDate = (dateStr) => (dateStr || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')

  // 立即付款按鈕：導向第一張票的 concertId
  const handlePayment = () => {
    if (tickets.length > 0) {
      const { concertId } = tickets[0]
      router.push(`/booking/${concertId}`)
    }
  }

  return (
    <main className="ticket-main-bg">
      <div className="ticket-title">票券匣</div>
      <div className="ticket-card">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>演唱會名稱</th>
              <th>場次</th>
              <th>座位</th>
              <th>時間</th>
              <th>地點</th>
              <th>價格</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.concertName}</td>
                <td>{formatShowDate(ticket.show)}</td>
                <td>{ticket.seat}</td>
                <td>{ticket.date}</td>
                <td>{ticket.venue}</td>
                <td className="price">{ticket.price} 元</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div className="ticket-total" aria-label="票券總價">
          總價 <span className="total-price">$ {totalPrice} 元</span>
        </div> */}

        {/* <div className="banner-btns">
          <button className="btn btn-danger" onClick={handlePayment}>
            立即付款
          </button>
        </div> */}
      </div>
    </main>
  )
}
