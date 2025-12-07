'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {
  getCart,
  updateCartItemCount,
  removeCartItem,
  clearCart,
  CartItem
} from '../../_api/cart'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCart = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const res = await getCart()
      setItems(res.data?.products || [])
      setTotalPrice(res.data?.totalCartPrice || 0)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to load cart. Please try again.'
      setError(msg)
    } finally {
      setUpdatingId(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeCount = async (item: CartItem, delta: number) => {
    const newCount = item.count + delta
    if (newCount < 1) return

    try {
      setUpdatingId(item.product._id)
      await updateCartItemCount(item.product._id, newCount)
      await loadCart()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Failed to update item. Please try again.'
      setError(msg)
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      setUpdatingId(itemId)
      await removeCartItem(itemId)
      await loadCart()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Failed to remove item. Please try again.'
      setError(msg)
    }
  }

  const handleClear = async () => {
    try {
      setUpdatingId('all')
      await clearCart()
      await loadCart()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Failed to clear cart. Please try again.'
      setError(msg)
    }
  }

  return (
    <main className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Cart
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Review and manage the products in your cart.
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={updatingId === 'all'}
              className="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-rose-400 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear cart
            </button>
          )}
        </header>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center shadow-sm animate-pulse"
              >
                <div className="h-24 w-24 rounded-lg bg-linear-to-br from-slate-200 to-slate-300 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error &&
          items.length === 0 && (
            <div className="text-center text-slate-600 text-sm py-10 flex flex-col gap-4 items-center">
              <p>Your cart is empty.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
              >
                Browse products
              </Link>
            </div>
          )
        )}

        {!error && items.length > 0 && (
          <div className="space-y-6">
            <section className="space-y-4">
              {!isLoading &&
                items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center shadow-sm"
                  >
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative group">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.product.ratingsAverage && (
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center">
                          <svg
                            className="w-2.5 h-2.5 text-amber-400 mr-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {item.product.ratingsAverage.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 pr-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.product._id}`}
                            className="text-sm font-semibold text-slate-800 hover:text-rose-500 line-clamp-2"
                          >
                            {item.product.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {item.product.brand && (
                              <span className="text-xs text-slate-500">
                                {item.product.brand.name}
                              </span>
                            )}
                            {item.product.category && (
                              <span className="text-xs text-slate-400">
                                • {item.product.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-rose-500">
                            {item.price * item.count} EGP
                          </p>
                          {item.count > 1 && (
                            <p className="text-xs text-slate-400">
                              {item.price} EGP × {item.count}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-slate-500">
                          Availability:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            item.product.quantity > 0
                              ? 'text-green-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {item.product.quantity > 0
                            ? `In stock (${item.product.quantity} available)`
                            : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleChangeCount(item, -1)}
                          disabled={
                            updatingId === item.product._id || item.count <= 1
                          }
                          className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm">
                          {item.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChangeCount(item, 1)}
                          disabled={updatingId === item.product._id}
                          className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product._id)}
                        disabled={updatingId === item.product._id}
                        className="text-xs text-rose-500 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-4 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-800">Order Summary</h3>
                <span className="text-sm text-slate-500">
                  {items.length} items
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-slate-200 my-2"></div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-rose-500">{totalPrice} EGP</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  or{' '}
                  <Link
                    href="/products"
                    className="text-rose-500 hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
