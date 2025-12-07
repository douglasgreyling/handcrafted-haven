'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { formatPrice } from '../../../lib/utils'
import { useCart } from '../../../lib/CartContext'
import ReviewForm from '../../../components/ReviewForm'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        if (data.authenticated && data.user) {
          setCurrentUserId(data.user.id)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true)

        const productResponse = await fetch(`/api/products?id=${params.id}`)
        if (!productResponse.ok) {
          throw new Error('Product not found')
        }
        const productData = await productResponse.json()
        setProduct(productData.products[0])

        const reviewsResponse = await fetch(`/api/products/${params.id}/reviews`)
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData.reviews)
          setAverageRating(reviewsData.averageRating)
          setTotalReviews(reviewsData.totalReviews)

          if (currentUserId) {
            const hasReviewed = reviewsData.reviews.some(
              (review) => review.userId === currentUserId
            )
            setUserHasReviewed(hasReviewed)
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProductAndReviews()
    }
  }, [params.id, currentUserId])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth')
      return
    }

    try {
      setAdding(true)
      await addToCart(product.id, 1)
      setTimeout(() => setAdding(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAdding(false)
    }
  }

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews])
    setTotalReviews(totalReviews + 1)
    setUserHasReviewed(true)

    const newAverage = (averageRating * totalReviews + newReview.rating) / (totalReviews + 1)
    setAverageRating(Math.round(newAverage * 10) / 10)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Product not found'}
          </h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/products')}
        className="mb-6"
      >
        ← Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-24 w-24 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>No Image Available</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.category && (
                <Badge variant="category">{product.category}</Badge>
              )}
            </div>

            {totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalReviews}{' '}
                  {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-indigo-600 mb-4">
              {formatPrice(product.priceCents)}
            </p>

            {!product.inStock && (
              <Badge variant="destructive" className="mb-4">
                Out of Stock
              </Badge>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || adding}
            size="lg"
            className="w-full"
          >
            {adding ? 'Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {isAuthenticated && !userHasReviewed && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              <Button
                variant="link"
                onClick={() => router.push('/auth')}
                className="px-1"
              >
                Sign in
              </Button>
              to leave a review
            </p>
          </div>
        )}

        {isAuthenticated && userHasReviewed && (
          <div className="mb-8 p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-700">
              Thank you for your review!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500 pt-4">
                No reviews yet. Be the first to review this product!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{review.user.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
