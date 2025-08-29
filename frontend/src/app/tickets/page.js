'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    const fetchTickets = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    console.warn('Token 不存在，取消請求')
    return
  }

  try {
    const res = await axios.get(`${apiBaseUrl}/api/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = res.data

        const formatted = data.map(order => ({
          id: order.id,
          concertName: order.ticket_info.show_title,
          show: order.ticket_info.show_date.replace(/-/g, ''), // "2025-10-05" -> "20251005"
          seat: order.ticket_info.seat,
          date: order.ticket_info.show_time,
          venue: order.ticket_info.venue,
          price: order.ticket_info.price,
          concertId: order.ticket_info.id,
          status: order.ticket_info.ticket_status,
        }))

        setTickets(formatted)
      } catch (err) {
        console.error('取得票券時發生錯誤', err)
      }
    }

    if (user) {
      fetchTickets()
    }
  }, [user, loading, router])

  if (loading) return <div className="text-center py-5">載入中...</div>

  const totalPrice = tickets.reduce((sum, ticket) => sum + ticket.price, 0)
  const formatShowDate = (dateStr) => (dateStr || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')

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
              <th>場地及座位</th>
              <th>時間</th>
              <th>價格</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.concertName}</td>
                <td>{formatShowDate(ticket.show)}</td>
                <td>{ticket.seat}</td>
                <td>{ticket.date}</td>
                <td className="price">{ticket.price} 元</td>
                <td>{ticket.status}</td>
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