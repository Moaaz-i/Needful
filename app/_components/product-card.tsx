// app/_components/product-card.tsx
'use client'

import Link from 'next/link'
import {Product} from '@/types'
import {cn} from '@/lib/utils'
import {Button} from './ui/button'
import {ShoppingCart, Trash2} from 'lucide-react'
import useCart from '../hooks/use-cart'

interface ProductCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  product: Product
  className?: string
}

export function ProductCard({product, className, ...props}: ProductCardProps) {
  const {items, addItem, removeItem} = useCart()
  const isInCart = items.some((item) => item._id === product._id)

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCart) {
      const cartItem = items.find((item) => item._id === product._id)
      if (cartItem) {
        removeItem(cartItem._id)
      }
    } else {
      addItem(product)
    }
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md',
        className
      )}
      {...props}
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageCover}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex-1 p-4">
        <h3 className="mb-1 text-sm font-medium text-slate-900 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-500">
              ${product.price.toFixed(2)}
            </p>
            {product.priceAfterDiscount && (
              <p className="text-xs text-slate-400 line-through">
                ${product.priceAfterDiscount.toFixed(2)}
              </p>
            )}
          </div>
          <Button
            variant={isInCart ? 'destructive' : 'default'}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleCartAction}
          >
            {isInCart ? (
              <Trash2 className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}
