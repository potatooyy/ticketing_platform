//src/hook/useCart.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  // 新增商品，item 是物件，可包含 ticketId, showId, price 等
  const addToCart = (item) => {
    setCartItems((prev) => {
      // 避免重複同一票
      if (prev.some((cartItem) => cartItem.ticketId === item.ticketId)) {
        return prev
      }
      return [...prev, item]
    })
  }

  // 移除商品，依 ticketId 或陣列索引刪除
  const removeFromCart = (ticketId) => {
    setCartItems((prev) => prev.filter((item) => item.ticketId !== ticketId))
  }

  // 清空購物車
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
