'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      } else if (response.status === 401) {
        // User not authenticated, clear cart
        setCart(null)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      })

      if (response.ok) {
        await fetchCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId, quantity })
      })

      if (response.ok) {
        await fetchCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating quantity:', error)
      return false
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from cart:', error)
      return false
    }
  }

  const checkout = async () => {
    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST'
      })

      if (response.ok) {
        await fetchCart()
        return true
      }
      return false
    } catch (error) {
      console.error('Error during checkout:', error)
      return false
    }
  }

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.product.priceCents * item.quantity)
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkout,
        getCartItemCount,
        getCartTotal,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
