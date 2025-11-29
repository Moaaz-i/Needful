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

  const loadCart = async () => {
    try {
      setError(null)
      const res = await getCart()
      setItems(res.data?.products || [])
      setTotalPrice(res.data?.totalCartPrice || 0)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to load cart. Please try again.'
      setError(msg)
    } finally {
      setUpdatingId(null)
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
      setUpdatingId(item._id)
      await updateCartItemCount(item._id, newCount)
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

        {!error && items.length === 0 && (
          <div className="text-center text-slate-600 text-sm py-10 flex flex-col gap-4 items-center">
            <p>Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
            >
              Browse products
            </Link>
          </div>
        )}

        {!error && items.length > 0 && (
          <div className="space-y-6">
            <section className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 items-center shadow-sm"
                >
                  <div className="h-20 w-20 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="text-sm font-semibold hover:text-rose-500 line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      Price:{' '}
                      <span className="text-rose-500 font-semibold">
                        {item.price} EGP
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChangeCount(item, -1)}
                        disabled={updatingId === item._id || item.count <= 1}
                        className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">
                        {item.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeCount(item, 1)}
                        disabled={updatingId === item._id}
                        className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item._id)}
                      disabled={updatingId === item._id}
                      className="text-xs text-rose-500 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <section className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-sm text-slate-600">Total</div>
              <div className="text-lg font-semibold text-rose-500">
                {totalPrice} EGP
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
