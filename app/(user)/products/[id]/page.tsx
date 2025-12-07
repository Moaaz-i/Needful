'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {getProductById} from '../../../_api/products'
import {Product} from '@/types'
import {addToCart} from '../../../_api/cart'
import {
  useRealtimeWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
  useRealtimeCart,
  useAddToCart,
  useRemoveFromCart
} from '../../../_hooks/use-api-query'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import {Pagination, Autoplay} from 'swiper/modules'
import {Heart, ShoppingCart} from 'lucide-react'

export default function ProductDetails() {
  const params = useParams()
  const id = (params as {id?: string})?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  // Wishlist and Cart hooks
  const {wishlistItems} = useRealtimeWishlist()
  const {cartItems} = useRealtimeCart()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  const addToCartMutation = useAddToCart()
  const removeFromCartMutation = useRemoveFromCart()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Check if product is in wishlist
  const isInWishlist =
    wishlistItems && Array.isArray(wishlistItems)
      ? wishlistItems.some((item: any) => {
          if (!item) return false
          return (
            (item.product && item.product._id === id) ||
            item._id === id ||
            item.id === id
          )
        })
      : false

  // Check if product is in cart
  const cartItem = cartItems?.find((item) => item.product._id === id)
  const isInCart = !!cartItem

  const handleWishlistAction = async () => {
    if (!id) return
    setUpdatingId(id)

    try {
      if (isInWishlist && wishlistItems && Array.isArray(wishlistItems)) {
        const wishlistItem = wishlistItems.find((item: any) => {
          if (!item) return false
          return (
            (item.product && item.product._id === id) ||
            item._id === id ||
            item.id === id
          )
        })
        if (wishlistItem && wishlistItem._id) {
          await removeFromWishlistMutation.mutateAsync(wishlistItem._id)
        }
      } else {
        await addToWishlistMutation.mutateAsync(id)
      }
    } catch (error) {
      console.error('Wishlist action failed:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAddToCart = async () => {
    if (!id) return
    setAdding(true)
    setAddError(null)

    try {
      await addToCartMutation.mutateAsync(id)
    } catch (error) {
      setAddError('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveFromCart = async () => {
    if (!id || !cartItem) return
    setUpdatingId(id)

    try {
      await removeFromCartMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUpdateQuantity = async (delta: number) => {
    if (!id || !cartItem) return
    const newCount = cartItem.count + delta
    if (newCount < 1) return

    setUpdatingId(id)

    try {
      // For now, we'll remove and re-add to update quantity
      // You might want to implement a proper updateQuantity API call
      await removeFromCartMutation.mutateAsync(id)
      for (let i = 0; i < newCount; i++) {
        await addToCartMutation.mutateAsync(id)
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        if (!mounted) return
        setProduct(data)
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading product details. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchProduct()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center text-xs">
              ←
            </span>
            <span>Back</span>
          </button>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && product && (
          <div className="grid gap-8">
            <div className="grid gap-8 md:grid-cols-[1.2fr,1fr] items-start">
              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-[480px] w-full overflow-hidden bg-slate-100">
                  <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={16}
                    className="w-full h-full p-0"
                    loop={true}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true
                    }}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false
                    }}
                    modules={[Pagination, Autoplay]}
                  >
                    {[product.imageCover, ...(product.images || [])].map(
                      (image, index) => (
                        <SwiperSlide key={index} className="w-full h-full">
                          <img
                            src={image}
                            alt={`${product.title} - ${index + 1}`}
                            className="h-full w-full object-contain"
                          />
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </div>
              </section>

              <section className="flex flex-col gap-4 px-4 md:px-0">
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                      {product.title}
                    </h1>
                    {product.brand && (
                      <img
                        src={product.brand.image}
                        alt={product.brand.name}
                        className="h-8 object-contain"
                      />
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="mt-3 flex items-center gap-3">
                    {/* Wishlist Status */}
                    <button
                      type="button"
                      onClick={handleWishlistAction}
                      disabled={updatingId === id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        isInWishlist
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist ? 'fill-current' : ''
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                      </span>
                    </button>

                    {/* Cart Status */}
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        isInCart
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {isInCart
                          ? `In Cart (${cartItem?.count || 1})`
                          : 'Not in Cart'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-4">
                    {product.ratingsAverage && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                        <svg
                          className="w-4 h-4 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-amber-700">
                          {product.ratingsAverage.toFixed(1)}
                          <span className="text-slate-400 ml-1">
                            ({product.ratingsQuantity || 0})
                          </span>
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-slate-500">
                      {product.sold?.toLocaleString()} sold
                    </span>
                    <span className="text-sm text-slate-500">
                      {product.quantity} in stock
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-rose-500">
                      {product.priceAfterDiscount || product.price} EGP
                    </p>
                    {product.priceAfterDiscount &&
                      product.price > product.priceAfterDiscount && (
                        <span className="text-slate-400 line-through">
                          {product.price} EGP
                        </span>
                      )}
                    {product.priceAfterDiscount &&
                      product.price > product.priceAfterDiscount && (
                        <span className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {Math.round(
                            (1 - product.priceAfterDiscount / product.price) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                  </div>
                </div>

                {product.category && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>Category:</span>
                    <span className="font-medium">{product.category.name}</span>
                  </div>
                )}

                {product.subcategory && product.subcategory.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>Subcategory:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.subcategory.map((sub) => (
                        <span
                          key={sub._id}
                          className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {addError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm">
                    {addError}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  {isInCart && cartItem ? (
                    // Cart Management Interface
                    <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(-1)}
                        disabled={updatingId === id || cartItem.count <= 1}
                        className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="min-w-12 text-center font-semibold">
                        {cartItem.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(1)}
                        disabled={updatingId === id}
                        className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={handleRemoveFromCart}
                        disabled={updatingId === id}
                        className="px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    // Add to Cart Button
                    <button
                      type="button"
                      disabled={adding}
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0h10m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                    Product Details
                  </h3>
                  <div className="prose prose-sm max-w-none text-slate-600">
                    {product.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Product Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-900">Brand</h3>
                  <p className="text-sm text-slate-600">
                    {product.brand?.name || 'No brand information'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-900">
                    Category
                  </h3>
                  <p className="text-sm text-slate-600">
                    {product.category?.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-900">
                    Availability
                  </h3>
                  <p className="text-sm text-slate-600">
                    {product.quantity > 0 ? (
                      <span className="inline-flex items-center text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        In Stock ({product.quantity} available)
                      </span>
                    ) : (
                      <span className="text-rose-600">Out of Stock</span>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-900">SKU</h3>
                  <p className="text-sm text-slate-600">{product._id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!error && !product && (
          <div className="text-center text-slate-300 text-sm py-10">
            Product not found.
          </div>
        )}
      </div>
    </main>
  )
}
