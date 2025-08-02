'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

export default function CartPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState(null)
  const [editOrderId, setEditOrderId] = useState(null) // 進行編輯的訂單ID
  const [editSection, setEditSection] = useState('')
  const [editSeat, setEditSeat] = useState('')

  // 取得目前用戶訂單
  const fetchUserOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/user/orders')
      setOrders(res.data || [])
    } catch {
      setError('載入訂單資料失敗')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserOrders()
  }, [])

  // 刪除/取消訂單
  const handleCancelOrder = async (id) => {
    if (!window.confirm('確定要取消這筆訂單嗎？')) return
    try {
      await api.delete(`/orders/${id}`)
      await fetchUserOrders()
      alert('訂單已取消')
    } catch {
      alert('取消訂單失敗')
    }
  }

  // 進入編輯狀態
  const handleEditOrder = (order) => {
    setEditOrderId(order.id)
    setEditSection(order.ticket_info.section)
    setEditSeat(order.ticket_info.seat)
  }

  // 送出編輯
  const handleSaveEdit = async (order) => {
    try {
      // 只演示 PATCH 指定欄位
      await api.patch(`/orders/${order.id}`, {
        // 視API設計填入變動欄位
        ticket_info: {
          ...order.ticket_info,
          section: editSection,
          seat: editSeat,
        }
      })
      setEditOrderId(null)
      await fetchUserOrders()
      alert('編輯成功')
    } catch {
      alert('編輯失敗')
    }
  }

  // 清空order
  const clearCartAfterOrder = async () => {
    // 假設：後端付款成功callback會自動移除已付款訂單
    // 此處只會觸發付款，無清本地 useCart 狀態
    await fetchUserOrders()
  }

  // 綠界付款串接
  const handlePay = async () => {
    setPaying(true)
    try {
      // 將所有尚未付款訂單 id 傳後端
      const unpaidOrderIds = orders.filter(o => o.status === 'pending').map(o => o.id)
      if (unpaidOrderIds.length === 0) {
        alert('沒有可付款的訂單')
        setPaying(false)
        return
      }
      const res = await api.post('/payments/create', {
        order_ids: unpaidOrderIds
      })
      if (res.data && res.data.payment_url) {
        // 跳轉綠界
        clearCartAfterOrder()
        window.location.href = res.data.payment_url
      } else {
        alert('無法產生付款連結')
      }
    } catch {
      alert('付款請求失敗')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <div className="text-center py-5">載入中...</div>
  if (error) return <div className="text-center py-5 text-danger">{error}</div>
  if (orders.length === 0) return <p className="text-center py-5 text-white">購物車是空的</p>

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-white/20">
        <h1 className="text-4xl font-extrabold mb-8 text-white text-center tracking-tight">🛒 我的購物車</h1>
        <ul className="space-y-6">
          {orders.map(order => (
            <li
              key={order.id}
              className="p-5 bg-white/10 border border-white/20 rounded-xl shadow-md text-white flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="mb-1 text-xl font-bold">訂單號: {order.order_number}</p>
                  <p className="mb-1">狀態: <span className={order.status === 'paid' ? 'text-green-300' : 'text-yellow-300'}>{order.status}</span></p>
                  <p className="mb-1">總金額: NT${order.total_amount}</p>
                </div>
                {/* 刪除/取消 */}
                {order.status !== 'paid' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="ml-4 px-3 py-1 rounded bg-red-700 text-black hover:bg-red-800"
                  >取消</button>
                )}
              </div>
              <div>
                {editOrderId !== order.id ? (
                  <>
                    <p className="underline mb-1 font-semibold">票券明細：</p>
                    {order.ticket_info ? (
                      <ul className='pl-2'>
                        <li>
                          演唱會: {order.ticket_info.show_title} | 區域: {order.ticket_info.section} | 座位: {order.ticket_info.seat} | 價格: NT${order.ticket_info.price}
                        </li>
                      </ul>
                    ) : (
                      <p>無票券明細</p>
                    )}
                    {/* 編輯按鈕 */}
                    {order.status !== 'paid' &&
                      <button
                        className="mt-2 px-3 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-600"
                        onClick={() => handleEditOrder(order)}>
                        編輯
                      </button>
                    }
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <label>區域:</label>
                      <input className="px-1 py-0.5 rounded" value={editSection} onChange={e => setEditSection(e.target.value)} />
                      <label>座位:</label>
                      <input className="px-1 py-0.5 rounded" value={editSeat} onChange={e => setEditSeat(e.target.value)} />
                      <button
                        className="ml-2 px-2 py-1 rounded bg-green-600 text-white"
                        onClick={() => handleSaveEdit(order)}>
                        儲存
                      </button>
                      <button
                        className="ml-1 px-2 py-1 rounded bg-gray-600 text-black"
                        onClick={() => setEditOrderId(null)}>
                        取消
                      </button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
        {/* 付款按鈕 */}
        <button
          disabled={paying || orders.filter(o => o.status === 'pending').length === 0}
          onClick={handlePay}
          className="mt-7 w-full py-3 font-bold rounded-xl bg-green-500 text-black hover:bg-green-600 text-2xl"
        >
          {paying ? '建立付款連結中...' : '前往付款 (綠界)'}
        </button>
      </div>
    </main>
  )
}
