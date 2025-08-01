// src/app/booking/[id]/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getConcertById } from '@/data/concerts'
import SeatMap from '@/components/booking/SeatMap'
import PriceTable from '@/components/booking/PriceTable'

export default function BookingPage({ params }) {
  const { id } = params

  const [concert, setConcert] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' })
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // 載入演唱會資料
  useEffect(() => {
    const concertData = getConcertById(id)
    if (!concertData) {
      router.push('/concerts')
      return
    }
    setConcert(concertData)
  }, [id, router])

  // 預設第一場場次（有多場可以改成需求）
  useEffect(() => {
    if (concert && concert.shows?.length > 0 && selectedShow === null) {
      setSelectedShow(concert.shows[0].id)
    }
  }, [concert, selectedShow])

  // 身份驗證跳轉
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')  // 請確認路由設定正確
    }
  }, [user, authLoading, router])

  // 加入訂單
  const handleAddToOrder = () => {
    if (!selectedSeat || !selectedShow) {
      alert('請先選擇場次與座位！')
      return
    }

    const zone = selectedSeat.charAt(0)
    const price = concert.pricing[zone] ?? 0
    const newItem = {
      id: `${selectedShow}-${selectedSeat}`,
      show: selectedShow,
      seat: selectedSeat,
      price
    }

    if (orderItems.some(item => item.id === newItem.id)) {
      alert('該座位已加入訂單！')
      return
    }

    setOrderItems([...orderItems, newItem])
    setSelectedSeat(null) // 加入成功後清空
  }

  // 提交訂單
  const handleSubmitOrder = (e) => {
    e.preventDefault()
    if (orderItems.length === 0) {
      alert('請先將座位加入訂單！')
      return
    }
    if (!customerInfo.name || !customerInfo.email) {
      alert('請填寫姓名和電子郵件！')
      return
    }
    alert('訂單已送出，感謝您的購買！')
    router.push('/tickets')
  }

  if (!concert || authLoading) {
    return <div className="text-center py-5">載入中...</div>
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <main className="container-xxl order-page py-4 py-lg-5 flex-grow-1" style={{ minHeight: '640px' }}>
      <div className="row g-5 align-items-stretch">
        {/* 左: 選座位 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="w-100 h-100 d-flex flex-column justify-content-center">
            <h2 className="order-step mb-4">1. 選擇座位</h2>
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <SeatMap concert={concert} selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} />
            </div>
          </div>
        </section>

        {/* 右: 選擇場次與加入訂單 */}
        <section className="col-lg-6 d-flex flex-column justify-content-center align-items-center h-100">
          <div className="order-main-card card p-4 rounded-4 shadow-lg border-0 w-100 h-100 d-flex flex-column">
            <h2 className="order-step mb-4">2. 選擇場次</h2>

            <div className="showtime-list mb-4">
              {concert.shows?.map((show) => (
                <div
                  key={show.id}
                  className={`list-group-item ${selectedShow === show.id ? 'active' : ''}`}
                  onClick={() => setSelectedShow(show.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedShow(show.id)
                  }}
                >
                  {show.date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3')}
                </div>
              ))}
            </div>

            <h3 className="order-subtitle mb-3">票價資訊</h3>
            <PriceTable pricing={concert.pricing} />

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

      {/* 填寫訂購資訊 */}
      <div className="row g-5 mt-5 align-items-start">
        <section className="col-lg-4">
          <h2 className="order-step mb-2">填寫訂購資訊</h2>
          <p className="text-secondary small mb-4">請填寫以下資訊以便完成訂購。</p>
        </section>
        <section className="col-lg-8">
          <form className="order-form" onSubmit={handleSubmitOrder}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">姓名</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">電子郵件</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                required
              />
            </div>
            <div className="order-summary mb-4">
              <h4 className="small fw-bold mb-2">訂單明細</h4>
              <div className="table-responsive">
                <table className="table table-sm table-bordered text-center mb-0">
                  <thead className="table-light text-dark">
                    <tr>
                      <th>場次</th>
                      <th>座位</th>
                      <th>價格</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.show.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3')}</td>
                        <td>{item.seat}</td>
                        <td>$ {item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="2" className="text-end">總價</th>
                      <th>$ {totalPrice}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-outline-light flex-grow-1"
                onClick={() => {
                  setOrderItems([])
                  setCustomerInfo({ name: '', email: '' })
                  setSelectedSeat(null)
                  setSelectedShow(null)
                }}
              >
                取消
              </button>
              <button type="submit" className="btn btn-danger flex-grow-1">
                確認訂單
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
