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

  const [show, setShow] = useState(null)     // 從 /api/shows/{id} 取得演出細節(可用可不使用)
  const [pricings, setPricings] = useState([]) // 票價資訊
  const [tickets, setTickets] = useState([])   // 票券(座位)資訊
  const [selectedSeat, setSelectedSeat] = useState(null) // 選中票 id
  const [orderItems, setOrderItems] = useState([])       // 訂單明細

  // 取得演出細節
  useEffect(() => {
    if (!showId) return
    async function fetchShow() {
      try {
        const res = await api.get(`/shows/${showId}`)
        setShow(res.data)
      } catch {
        router.push('/concerts') // 找不到show跳轉
      }
    }
    fetchShow()
  }, [showId, router])

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

  // 取得票券並攤平 seat 物件
  useEffect(() => {
    if (!showId) return
    async function fetchTickets() {
      try {
        const res = await api.get(`/tickets?show=${showId}`)
        // 攤平成扁平物件，方便後續存取
        const normalizedTickets = res.data.map(ticket => ({
          ...ticket,
          section: ticket.seat?.section || '未分區',
          seat_number: ticket.seat?.seat_number || '無座位號',
          price: ticket.price, // 如需價錢用此或用 pricings 配對
        }))
        setTickets(normalizedTickets)
      } catch {
        setTickets([])
      }
    }
    fetchTickets()
  }, [showId])

  // 權限檢查，未登入跳登入頁
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // 加入訂單按鈕動作
  const handleAddToOrder = () => {
    if (!selectedSeat) {
      alert('請選擇座位')
      return
    }
    const ticket = tickets.find(t => t.id === selectedSeat)
    if (!ticket) {
      alert('座位資料有誤')
      return
    }
    if (orderItems.some(item => item.ticketId === ticket.id)) {
      alert('該座位已加入訂單！')
      return
    }

    // 以票價API價格優先，找不到再用 ticket 自帶 price
    const priceFromPricing = pricings.find(p => p.section === ticket.section)?.price
    const price = typeof priceFromPricing === 'number' ? priceFromPricing : (ticket.price || 0)

    setOrderItems([...orderItems, {
      ticketId: ticket.id,
      section: ticket.section,
      seatNumber: ticket.seat_number,
      price,
    }])
    setSelectedSeat(null)
  }

  // 計算總價用
  const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0)

  // 等待資料與認證
  if (authLoading || !show || !pricings.length || !tickets.length) {
    return <div className="text-center py-5">載入中...</div>
  }

  return (
    <main className="container-xxl order-page py-4 py-lg-5 flex-grow-1" style={{ minHeight: '640px' }}>
      <div className="row g-5 align-items-stretch">
        {/* 左側: 選座位 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="w-100 h-100 d-flex flex-column justify-content-center">
            <h2 className="order-step mb-4">1. 選擇座位</h2>
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <SeatMap
                tickets={tickets}
                selectedSeat={selectedSeat}
                onSeatSelect={setSelectedSeat}
              />
            </div>
          </div>
        </section>

        {/* 右側: 票價資訊與加入訂單 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="order-main-card card p-4 rounded-4 shadow-lg border-0 w-100 h-100 d-flex flex-column">
            <h2 className="order-step mb-4">2. 票價資訊</h2>
            <PriceTable prices={pricings} />
            <button
              className="btn btn-danger px-5 mt-auto align-self-start"
              onClick={handleAddToOrder}
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
          </div>
        </section>
      </div>
    </main>
  )
}
