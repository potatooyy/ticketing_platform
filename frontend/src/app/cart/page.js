'use client'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-white/20">
        <h1 className="text-4xl font-extrabold mb-8 text-white text-center tracking-tight">🛒 我的購物車</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-300 text-xl text-center">購物車是空的</p>
        ) : (
          <ul className="space-y-6">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-5 bg-white/10 border border-white/20 rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-150"
              >
                <div>
                  <p className="text-xl font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-gray-300">NT${item.price}</p>
                </div>
                <button
  onClick={() => removeFromCart(index)}
  style={{ backgroundColor: '#dc2626', color: 'white' }} // 紅色底 + 白字
  className="px-4 py-2 rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-150"
>
  移除
</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
