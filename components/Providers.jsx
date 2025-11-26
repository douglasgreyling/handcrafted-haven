'use client'

import { CartProvider } from '../lib/CartContext'

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
