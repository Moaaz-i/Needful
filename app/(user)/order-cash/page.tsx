'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {getCart, CartItem} from '../../_api/cart'
import {createOrder} from '../../_api/orders'
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiCheck
} from 'react-icons/fi'
import {Address, getAddresses} from '@/app/_api/addresses'

interface OrderFormData {
  firstName: string
  lastName: string
  address: string
  notes: string
}

export default function OrderCashPage() {
  const {data: session} = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<{data: Address[]}>()

  useEffect(() => {
    getAddresses()
      .then((res) =>
        setAddresses({
          data: res.data
        })
      )
      .catch((err) => console.error(err))
  }, [])

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    address: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<OrderFormData>>({})
  const [orderCreated, setOrderCreated] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const res = await getCart()
      setItems(res.data?.products || [])
      setTotalPrice(res.data?.totalCartPrice || 0)

      if (!res.data?.products || res.data.products.length === 0) {
        router.push('/cart')
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to load cart. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}))
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: ''}))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Create order data in the expected format
      const orderData = {
        shippingAddress: {
          details: formData.address,
          phone:
            addresses?.data.find(
              (addr) => `${addr.details}, ${addr.city}` === formData.address
            )?.phone || '',
          city:
            addresses?.data.find(
              (addr) => `${addr.details}, ${addr.city}` === formData.address
            )?.city || ''
        }
      }

      let cartId = ''

      try {
        const cartResponse = await getCart()
        if (cartResponse.data?._id) {
          cartId = cartResponse.data._id
        } else {
          throw new Error('No cart ID found')
        }
      } catch (error) {
        console.error('Failed to get cart:', error)
        throw new Error('Failed to process your cart. Please try again.')
      }

      await createOrder(cartId, orderData.shippingAddress)
      router.push('/order-success')
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Failed to create order. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
          {error}
          <div className="mt-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="py-10 px-4 mobile-cart">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Cash on Delivery
          </h1>
          <p className="mt-2 text-slate-600 text-sm md:text-base">
            Complete your order details for cash on delivery.
          </p>
        </header>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiUser className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Customer Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.firstName ? 'border-rose-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.lastName ? 'border-rose-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping Information */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FiMapPin className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                        errors.address ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select your address</option>
                      {addresses?.data.map((addressData) => (
                        <option
                          key={addressData._id}
                          value={`${addressData.details}, ${addressData.city}`}
                        >
                          {addressData.name} - {addressData.details},{' '}
                          {addressData.city}
                        </option>
                      ))}
                    </select>
                    <Link
                      href="/profile/addresses"
                      className="inline-flex items-center justify-center px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                      title="Add new address"
                    >
                      <FiMapPin className="w-4 h-4" />
                    </Link>
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="Any special instructions for your order"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <FiCreditCard className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-semibold text-slate-900">
                  Order Summary
                </h2>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.price} EGP × {item.count}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 flex-shrink-0">
                      {item.price * item.count} EGP
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-3">
                  <span>Total</span>
                  <span className="text-rose-500">{totalPrice} EGP</span>
                </div>
              </div>

              {/* Cash on Delivery Notice */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <FiCreditCard className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Pay with cash when your order arrives. Please have the
                      exact amount ready.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mobile-cart-checkout"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  By placing this order, you agree to our{' '}
                  <Link href="/terms" className="text-rose-500 hover:underline">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
