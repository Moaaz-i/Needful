'use client'

import {useEffect, useState} from 'react'
import {getWishlist, removeFromWishlist} from '@/app/_api/wishlist'
import {Product} from '@/app/_api/products'
import {WishlistItem} from '@/app/_api/wishlist'
import {transformProduct} from '@/app/_api/products'
import {validateWishlistItems} from '@/lib/validation'
import {toast} from 'react-hot-toast'
import {FiHeart, FiArrowLeft, FiPackage, FiTrash2} from 'react-icons/fi'
import Link from 'next/link'
import {ProductCard} from '@/app/_components/product-card'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist()
      // API returns {status, count, data: [products]}
      // We need to transform products to WishlistItem format
      const products = response.data || []
      const wishlistItems: WishlistItem[] = products.map((product: any) => ({
        _id: product._id,
        product: product,
        user: 'current-user', // This should come from auth context
        createdAt: product.createdAt || new Date().toISOString()
      }))

      // Use comprehensive validation
      const validItems = validateWishlistItems(wishlistItems)
      setWishlistItems(validItems)
    } catch (error) {
      toast.error('Error loading wishlist')
      console.error('Error fetching wishlist:', error)
      setWishlistItems([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId))
    try {
      await removeFromWishlist(productId)
      setWishlistItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      )
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Error removing item')
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-linear-to-r from-rose-500 to-rose-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
                <p className="text-rose-100">Items you've saved for later</p>
              </div>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <FiHeart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-slate-600 mb-6">
              Start adding items you love to see them here
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
            >
              <FiPackage className="w-4 h-4" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((wishlistItem) => (
              <div key={wishlistItem.product._id} className="relative group">
                <ProductCard
                  product={transformProduct(wishlistItem.product)}
                  className="transform transition-all duration-300 hover:scale-105 pb-5"
                />

                {/* Custom Remove Button for Wishlist */}
                <button
                  onClick={() =>
                    handleRemoveFromWishlist(wishlistItem.product._id)
                  }
                  disabled={removingItems.has(wishlistItem.product._id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
