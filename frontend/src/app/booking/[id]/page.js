'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import api from '@/utils/api'
import SeatMap from '@/components/booking/SeatMap'
import PriceTable from '@/components/booking/PriceTable'

export default function BookingPage() {
  const params = useParams()
  const showId = params?.id
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // 從 API 取票券
  const [tickets, setTickets] = useState([])
  // 從 API 取票價區
  const [pricings, setPricings] = useState([])
  // 使用者選擇的票券ID
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  // 訂購明細
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 權限檢查，未登入導向登入頁面
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // 取得票券(座位)資訊，攤平成扁平物件方便操作
  useEffect(() => {
    if (!showId) return
    async function fetchTickets() {
      try {
        const res = await api.get(`/tickets?show=${showId}`)
        const normalizedTickets = res.data.map(ticket => ({
          ...ticket,
          section: ticket.seat?.section || '未分區',
          seat_number: ticket.seat?.seat_number || '無座位號',
          price: ticket.price,
        }))
        setTickets(normalizedTickets)
      } catch {
        setTickets([])
      }
    }
    fetchTickets()
  }, [showId])

  // 取得票價資訊
  useEffect(() => {
    if (!showId) return
    async function fetchPricings() {
      try {
        const res = await api.get(`/pricings?show_id=${showId}`)
        setPricings(res.data)
      } catch {
        setPricings([])
      }
    }
    fetchPricings()
  }, [showId])

  // 將選擇的座位加入訂單明細
  const addToOrder = () => {
    if (!selectedTicketId) {
      alert('請先選擇座位')
      return
    }
    const ticket = tickets.find(t => t.id === selectedTicketId)
    if (!ticket) {
      alert('選擇的座位資料有誤')
      return
    }
    if (orderItems.some(item => item.ticketId === ticket.id)) {
      alert('此座位已加入訂單')
      return
    }
    // 找票價作為價格
    const priceFromPricing = pricings.find(p => p.section === ticket.section)?.price
    const price = typeof priceFromPricing === 'number' ? priceFromPricing : (ticket.price || 0)

    setOrderItems(prev => [
      ...prev,
      {
        ticketId: ticket.id,
        section: ticket.section,
        seatNumber: ticket.seat_number,
        price,
      }
    ])
    setSelectedTicketId(null)
  }

  // 送出訂單到後端 API
  const submitOrderToBackend = async () => {
    if (orderItems.length === 0) {
      alert('請先將座位加入訂單')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // API限制一訂單一票，故逐張票送
      for (const item of orderItems) {
        const payload = {
          status: 'pending',
          ticket_ids: [item.ticketId],
        }
        await api.post('/orders', payload)
      }
      alert('訂單成功送出，您可以至購物車查看')
      router.push('/cart')
    } catch (e) {
      setError('訂單送出失敗，請稍後重試')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0)

  if (authLoading) {
    return <div className="text-center py-5">載入中...</div>
  }

  return (
    <main className="container-xxl order-page py-4 py-lg-5 flex-grow-1" style={{ minHeight: '640px' }}>
      <div className="row g-5 align-items-stretch">
        {/* 左：選擇座位 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="w-100 h-100 d-flex flex-column justify-content-center">
            <h2 className="order-step mb-4">1. 選擇座位</h2>
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <SeatMap
                tickets={tickets}
                selectedSeat={selectedTicketId}
                onSeatSelect={setSelectedTicketId}
              />
            </div>
          </div>
        </section>
        {/* 右：票價資訊與加入訂單 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="order-main-card card p-4 rounded-4 shadow-lg border-0 w-100 h-100 d-flex flex-column">
            <h2 className="order-step mb-4">2. 票價資訊</h2>
            <PriceTable prices={pricings} />
            <button
              className="btn btn-danger px-5 mt-auto align-self-start"
              onClick={addToOrder}
              type="button"
            >
              加入訂單
            </button>
          </div>
        </section>
      </div>

      {/* 訂單明細 */}
      <div className="row g-5 mt-5 align-items-start">
        <section className="col-lg-4">
          <h2 className="order-step mb-2">訂單明細</h2>
          <p className="text-secondary small mb-4">請確認您的選擇</p>
        </section>
        <section className="col-lg-8">
          <div className="order-summary mb-4">
            <h4 className="small fw-bold mb-2">訂單明細</h4>
            <div className="table-responsive">
              <table className="table table-sm table-bordered text-center mb-0">
                <thead className="table-light text-dark">
                  <tr>
                    <th>座位區</th>
                    <th>座位號</th>
                    <th>價格</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
                    <tr key={item.ticketId}>
                      <td>{item.section}</td>
                      <td>{item.seatNumber}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2" className="text-end">總價</th>
                    <th>${totalPrice}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              className="btn btn-success mt-3"
              disabled={loading || orderItems.length === 0}
              onClick={submitOrderToBackend}
              type="button"
            >
              {loading ? '送出訂單中...' : '送出訂單'}
            </button>
            {error && (
              <p className="text-danger mt-2">{error}</p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
