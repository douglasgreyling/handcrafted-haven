'use client'

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { formatPrice } from '../lib/utils'
import { useCart } from '../lib/CartContext'
import { useRouter } from 'next/navigation'

const ProductCard = ({ id, title, priceCents, imageUrl, category, description, inStock = true }) => {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const router = useRouter()

  const handleAddToCart = async (e) => {
    e.stopPropagation()

    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      if (!data.authenticated) {
        router.push('/auth')
        return
      }

      setAdding(true)
      const success = await addToCart(id, 1)

      if (success) {
        setTimeout(() => setAdding(false), 1000)
      } else {
        setAdding(false)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAdding(false)
    }
  }

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            {category && (
              <Badge variant="category" className="shrink-0">
                {category}
              </Badge>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-600">
            {formatPrice(priceCents)}
          </span>
        </div>

        <Button
          variant="cta"
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock || adding}
          className="shrink-0"
        >
          {adding ? 'Added!' : inStock ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;