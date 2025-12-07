'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {Product} from '@/types'
import {FiHeart, FiShoppingCart, FiTrash2} from 'react-icons/fi'
import {ProductCard} from '@/app/_components/product-card'
import {
  useRealtimeWishlist,
  useRemoveFromWishlist,
  useAddToCart
} from '../../_hooks/use-api-query'

export default function WishlistPage() {
  const {wishlistItems, wishlistCount, isLoading, error} = useRealtimeWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  const addToCartMutation = useAddToCart()

  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRemoveFromWishlist = async (itemId: string) => {
    setUpdatingId(itemId)
    try {
      await removeFromWishlistMutation.mutateAsync(itemId)
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    setUpdatingId(productId)
    try {
      await addToCartMutation.mutateAsync(productId)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse h-[400px] flex flex-col">
                  <div className="aspect-square bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl mb-4 shrink-0"></div>
                  <div className="flex-1 flex flex-col">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-8 text-center">
            <FiHeart className="text-3xl mb-4 mx-auto" />
            <p className="font-medium">Failed to load wishlist</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-rose-100 to-pink-100 rounded-2xl mb-6">
            <FiHeart className="text-2xl md:text-3xl text-rose-500" />
          </div>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-rose-500 font-semibold mb-3">
            My Wishlist
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            {wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'} Saved
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Your favorite products, all in one place
          </p>
        </header>

        {/* Wishlist Items */}
        {!wishlistItems ||
        !Array.isArray(wishlistItems) ||
        wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
              <FiHeart className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-slate-500 mb-6">
              Start adding products you love to see them here
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
            >
              <FiShoppingCart />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {wishlistItems &&
              Array.isArray(wishlistItems) &&
              wishlistItems.map((wishlistItem: any) => {
                // Safety check for wishlist item and product
                if (
                  !wishlistItem ||
                  (!wishlistItem.product && !wishlistItem._id)
                ) {
                  return null
                }

                // Handle both nested product structure and direct product structure
                const product = wishlistItem.product || wishlistItem

                return (
                  <div
                    key={wishlistItem._id || wishlistItem.id}
                    className="relative group"
                  >
                    <ProductCard
                      product={product}
                      className="transform transition-all duration-300 hover:scale-105"
                    />

                    {/* Quick Actions Overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={updatingId === product._id}
                        className="h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch"
                      >
                        <FiShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFromWishlist(wishlistItem._id)
                        }
                        disabled={updatingId === wishlistItem._id}
                        className="h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistItems &&
          Array.isArray(wishlistItems) &&
          wishlistItems.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Continue Shopping
                <FiShoppingCart />
              </Link>
            </div>
          )}
      </div>
    </main>
  )
}
