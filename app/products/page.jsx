'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import ProductCard from '../../components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [debouncedMinPrice, setDebouncedMinPrice] = useState('')
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Debounce price filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [minPrice])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [maxPrice])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      })

      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }
      if (debouncedMinPrice) {
        params.set('minPrice', debouncedMinPrice)
      }
      if (debouncedMaxPrice) {
        params.set('maxPrice', debouncedMaxPrice)
      }
      if (debouncedSearchQuery) {
        params.set('search', debouncedSearchQuery)
      }

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products)
      setCategories(data.categories)
      setTotalPages(data.pagination.pages)
      setTotalProducts(data.pagination.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, debouncedMinPrice, debouncedMaxPrice, debouncedSearchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setSelectedCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setDebouncedMinPrice('')
    setDebouncedMaxPrice('')
    setCurrentPage(1)
  }

  const handleAddToCart = (productId) => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', productId)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchProducts} className="mt-4" variant="cta">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Handcrafted Products
        </h1>
        <p className="text-gray-600 text-lg">
          Discover unique, artisan-made items from talented creators
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="cta">
              Search
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Min Price ($)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Price ($)</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory !== 'all' && (
            <Badge variant="category" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
              {selectedCategory} ×
            </Badge>
          )}
          {debouncedMinPrice && (
            <Badge variant="category" className="cursor-pointer" onClick={() => {
              setMinPrice('')
              setDebouncedMinPrice('')
            }}>
              Min: ${debouncedMinPrice} ×
            </Badge>
          )}
          {debouncedMaxPrice && (
            <Badge variant="category" className="cursor-pointer" onClick={() => {
              setMaxPrice('')
              setDebouncedMaxPrice('')
            }}>
              Max: ${debouncedMaxPrice} ×
            </Badge>
          )}
          {debouncedSearchQuery && (
            <Badge variant="category" className="cursor-pointer" onClick={() => {
              setSearchQuery('')
              setDebouncedSearchQuery('')
            }}>
              "{debouncedSearchQuery}" ×
            </Badge>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {products.length} of {totalProducts} products
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              description={product.description}
              priceCents={product.priceCents}
              imageUrl={product.imageUrl}
              category={product.category}
              inStock={product.inStock}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          <Button onClick={clearFilters} className="mt-4" variant="cta">
            Clear Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "cta" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
