'use client'

import { useCart } from '../../lib/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, checkout, getCartTotal } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const router = useRouter()

  const handleQuantityChange = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId)
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    const success = await checkout()
    if (success) {
      router.push('/checkout/success')
    } else {
      alert('Checkout failed. Please try again.')
      setCheckingOut(false)
    }
  }

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  const isEmpty = cartItems.length === 0
  const subtotal = getCartTotal()
  const tax = Math.round(subtotal * 0.08) // 8% tax
  const total = subtotal + tax

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

          {isEmpty ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5M17 18a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM9 18a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some items to get started!</p>
              <Button variant="cta" onClick={() => router.push('/products')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.product.imageUrl || 'https://via.placeholder.com/150'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.product.description}
                        </p>
                        <p className="text-indigo-600 font-semibold mt-2">
                          {formatPrice(item.product.priceCents)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="cta"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Payment details will be collected on the next page
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
