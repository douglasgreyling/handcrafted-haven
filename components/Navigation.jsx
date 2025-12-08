'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBasket, User, LogOut, ShoppingCart } from 'lucide-react'
import { useCart } from '../lib/CartContext'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { getCartItemCount, refreshCart } = useCart()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      if (data.authenticated) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      await refreshCart() // Reset cart context after logout
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <ShoppingBasket className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Handcrafted Haven</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Products
              </Link>
              {user && (
                <Link
                  href="/my-products"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Products
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/cart" className="text-gray-600 hover:text-indigo-600 p-2 relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>

              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-3 border rounded-md px-2 py-1 border-gray-300">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">{user.username}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-indigo-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block text-gray-600 hover:text-indigo-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block text-gray-600 hover:text-indigo-600 px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {user && (
                <Link
                  href="/my-products"
                  className="block text-gray-600 hover:text-indigo-600 px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Products
                </Link>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                          <User className="h-5 w-5" />
                          <span className="text-sm font-medium">{user.username}</span>
                        </div>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="w-full text-left flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2 text-base font-medium"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth"
                        className="block text-center bg-indigo-600 text-white px-3 py-2 mx-3 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
