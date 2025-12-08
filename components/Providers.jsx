'use client'

import { CartProvider } from '../lib/CartContext'
import { Toaster } from 'sonner'

export default function Providers({ children }) {
  return (
    <>
      <CartProvider>
        <Toaster position="top-right" richColors />
        {children}
      </CartProvider>
    </>
  )
}
