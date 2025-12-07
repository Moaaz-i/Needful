// app/_components/product-card.tsx
'use client'

import {useState} from 'react'
import Link from 'next/link'
import {Product} from '@/types'
import {cn} from '@/lib/utils'
import {Button} from './ui/button'
import {ShoppingCart, Trash2} from 'lucide-react'
import {useGlobalState} from '../_contexts/global-state-context'
import {useAddToCart, useRemoveFromCart} from '../_hooks/use-api-query'

interface ProductCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  product: Product
  className?: string
}

export function ProductCard({product, className, ...props}: ProductCardProps) {
  const {state} = useGlobalState()
  const addToCartMutation = useAddToCart()
  const removeFromCartMutation = useRemoveFromCart()

  const cartItem = state.cart.items.find(
    (item) => item.product._id === product._id
  )
  const isInCart = !!cartItem
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleAddToCart = async (productId: string) => {
    setUpdatingId(productId)
    await addToCartMutation.mutateAsync(productId)
    setUpdatingId(null)
  }

  const handleCartAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCart && cartItem) {
      setUpdatingId(product._id)
      await removeFromCartMutation.mutateAsync(product._id)
      setUpdatingId(null)
    } else {
      await handleAddToCart(product._id)
    }
  }

  const handleChangeCount = async (delta: number) => {
    if (!cartItem) return
    const newCount = cartItem.count + delta
    if (newCount < 1) return

    setUpdatingId(product._id)
    // Will implement with useUpdateCartItem if needed
    setUpdatingId(null)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        className
      )}
    >
      <div
        key={product._id}
        className="group mobile-product-card h-[400px] flex flex-col p-4"
      >
        <Link
          href={`/products/${product._id}`}
          className="flex flex-1 flex-col"
        >
          <div className="aspect-square overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 relative shrink-0">
            <img
              src={product.imageCover}
              alt={product.title}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            />

            {/* Discount Badge */}
            {product.priceAfterDiscount &&
              product.priceAfterDiscount < product.price && (
                <div className="absolute top-3 right-3 bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {Math.round(
                    (1 - product.priceAfterDiscount / product.price) * 100
                  )}
                  % OFF
                </div>
              )}
          </div>

          <div className="px-1 flex-1 flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 mobile-text">
              {product.title}
            </h3>

            {/* Rating */}
            {product.ratingsAverage && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-amber-400">
                  <span>★</span>
                  <span className="text-slate-600 text-sm ml-1">
                    {product.ratingsAverage.toFixed(1)}
                  </span>
                </div>
                {product.ratingsQuantity && (
                  <span className="text-slate-400 text-xs">
                    ({product.ratingsQuantity})
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-2 mb-3">
              {product.priceAfterDiscount ? (
                <>
                  <span className="text-lg font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                    ${product.priceAfterDiscount}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              )}
            </div>

            {product.quantity <= 0 && (
              <div className="text-xs text-rose-500 font-medium mb-3">
                Out of Stock
              </div>
            )}

            <div className="mt-auto">
              {isInCart && cartItem ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleChangeCount(-1)
                    }}
                    disabled={
                      updatingId === product._id ||
                      cartItem.count <= 1 ||
                      state.cart.loading
                    }
                    className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm">
                    {cartItem.count}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleChangeCount(1)
                    }}
                    disabled={updatingId === product._id || state.cart.loading}
                    className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (cartItem) {
                        handleCartAction(e)
                      }
                    }}
                    disabled={updatingId === product._id || state.cart.loading}
                    className="text-xs text-rose-500 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart(product._id)
                  }}
                  disabled={
                    product.quantity <= 0 ||
                    updatingId === product._id ||
                    state.cart.loading
                  }
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transform hover:scale-105 transition-transform ${
                    product.quantity <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                  }`}
                >
                  {product.quantity <= 0
                    ? 'Out of Stock'
                    : updatingId === product._id || state.cart.loading
                    ? 'Adding...'
                    : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
