'use client'

import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {FiCheck, FiPackage, FiHome, FiShoppingBag} from 'react-icons/fi'

export default function OrderSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear cart after successful order
    const clearCart = async () => {
      try {
        // You might want to clear the cart here or redirect to cart clearing
        // This depends on your cart management strategy
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    }

    clearCart()
  }, [router])

  return (
    <main className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Order Placed Successfully!
          </h1>

          {/* Success Message */}
          <p className="text-slate-600 text-lg mb-8">
            Thank you for your order. We&apos;ve received your cash on delivery
            request and will process it shortly.
          </p>

          {/* Order Details */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-slate-900">
                Order Details
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Order Type</span>
                <span className="font-medium text-slate-900">
                  Cash on Delivery
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Delivery</span>
                <span className="font-medium text-slate-900">
                  2-4 business days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method</span>
                <span className="font-medium text-slate-900">
                  Cash on arrival
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-amber-800 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>
                  You&apos;ll receive a confirmation message with your order
                  details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Our team will prepare your items for shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>Have the exact amount ready when delivery arrives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>You can track your order status in your account</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <FiShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              href="/profile/orders"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-colors"
            >
              <FiHome className="w-4 h-4" />
              View Orders
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Need help? Contact our customer support at{' '}
              <a
                href="tel:+20123456789"
                className="text-rose-500 hover:underline"
              >
                +20 123 456 789
              </a>{' '}
              or email us at{' '}
              <a
                href="mailto:support@needful.com"
                className="text-rose-500 hover:underline"
              >
                support@needful.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
