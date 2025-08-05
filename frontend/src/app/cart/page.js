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

  // 取得用戶訂單
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // == 計算全部訂單總金額及商品名稱動態傳入 API ==
  const totalAmount = orders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
  const itemName = orders.map(o => o.ticket_info?.show_title || '票券').join('|')

  // 前往付款：送出目前所有未付款訂單資料
  const handlePay = async () => {
    if (totalAmount <= 0) {
      alert('購物車沒有有效訂單！')
      return
    }
    setPaying(true)
    setError(null)
    try {
      const unpaidOrderIds = orders.filter(o => o.status === 'pending').map(o => o.id)
      if (unpaidOrderIds.length === 0) {
        alert('沒有可付款的訂單')
        setPaying(false)
        return
      }
      const res = await api.post('/payments/create/', {
        amount: totalAmount,
        item_name: itemName,
        // optional: order_ids: unpaidOrderIds
      })
      if (res.data && res.data.form_html) {
        const div = document.createElement('div')
        div.innerHTML = res.data.form_html
        document.body.appendChild(div)
        div.querySelector('form').submit()
      } else if (res.data && res.data.payment_url) {
        window.location.href = res.data.payment_url
      } else {
        alert('無法產生付款頁面')
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
            <li key={order.id}
              className="p-5 bg-white/10 border border-white/20 rounded-xl shadow-md text-white flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="mb-1 text-xl font-bold">訂單號: {order.order_number}</p>
                  <p className="mb-1">
                    狀態: <span className={order.status === 'paid' ? 'text-green-300' : 'text-yellow-300'}>
                        {order.status}
                      </span>
                  </p>
                  <p className="mb-1">總金額: NT${order.total_amount}</p>
                </div>
                {order.status !== 'paid' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="ml-4 px-3 py-1 rounded bg-red-700 text-black hover:bg-red-800"
                  >取消</button>
                )}
              </div>
              <div>
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
              </div>
            </li>
          ))}
        </ul>
        <button
          disabled={paying || orders.filter(o => o.status === 'pending').length === 0}
          onClick={handlePay}
          className="mt-7 w-full py-3 font-bold rounded-xl bg-green-500 text-black hover:bg-green-600 text-2xl"
        >
          {paying ? '建立付款連結中...' : '前往付款 (綠界)'}
        </button>
        {/* 總計區塊 */}
        <div className="mt-6 p-4 bg-white/20 rounded-lg text-white font-semibold text-xl text-right">
          總計金額：NT$ {totalAmount}
        </div>
      </div>
    </main>
  )
}
