'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {getCart, CartItem} from '../../_api/cart'
import {createCheckoutSession, createOrder} from '../../_api/orders'
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiCheck,
  FiLoader
} from 'react-icons/fi'
import {config} from '@/lib/config'
import {getAddresses} from '@/app/_api/addresses'
import {Address} from '@/app/_api/addresses'

interface OrderFormData {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  notes: string
}

export default function OrderCardPage() {
  const {data: session} = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [useNewAddress, setUseNewAddress] = useState(false)

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<OrderFormData>>({})

  useEffect(() => {
    loadCart()
    const getAdress = async () => {
      let res = await getAddresses()
      setAddresses(res.data)
    }

    getAdress()
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
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (
      !useNewAddress &&
      !/^(01[0-2]|015)[0-9]{8}$/.test(formData.phone)
    ) {
      newErrors.phone = 'Please enter a valid Egyptian phone number'
    }

    if (useNewAddress) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required'
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required'
      }
    } else if (!selectedAddressId) {
      newErrors.address = 'Please select an address'
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

      // Get address data
      let addressData
      if (useNewAddress) {
        addressData = {
          details: formData.address,
          phone: formData.phone,
          city: formData.city
        }
      } else {
        const selectedAddress = addresses?.find(
          (addr) => addr._id === selectedAddressId
        )
        if (!selectedAddress) {
          throw new Error('Selected address not found')
        }
        addressData = {
          details: selectedAddress.details,
          phone: selectedAddress.phone,
          city: selectedAddress.city
        }
      }

      // Create order data in the expected format
      const orderData = {
        shippingAddress: addressData
      }

      // Get cart ID from the cart API response
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

      const returnUrl = config.nextAuthUrl

      const checkoutSession = await createCheckoutSession(
        cartId,
        returnUrl,
        orderData
      )

      // Redirect to payment gateway or success page
      if (checkoutSession?.session?.url) {
        window.location.href = checkoutSession.session.url
      }
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
            Card Payment
          </h1>
          <p className="mt-2 text-slate-600 text-sm md:text-base">
            Complete your order details for secure card payment.
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

              {/* Phone Number - Only show when using new address */}
              {useNewAddress && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.phone ? 'border-rose-500' : 'border-slate-300'
                    }`}
                    placeholder="01xxxxxxxxx"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Phone Display - Only show when using existing address */}
              {!useNewAddress && selectedAddressId && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600">
                    {
                      addresses?.find((addr) => addr._id === selectedAddressId)
                        ?.phone
                    }
                  </div>
                </div>
              )}
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
                {/* Address Selection */}
                {addresses && addresses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Address *
                    </label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => {
                        setSelectedAddressId(e.target.value)
                        setUseNewAddress(false)
                        if (errors.address) {
                          setErrors((prev) => ({...prev, address: ''}))
                        }
                        // Auto-populate phone from selected address
                        const selectedAddress = addresses?.find(
                          (addr) => addr._id === e.target.value
                        )
                        if (selectedAddress) {
                          setFormData((prev) => ({
                            ...prev,
                            phone: selectedAddress.phone
                          }))
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                        errors.address ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Choose an address...</option>
                      {addresses.map((address) => (
                        <option key={address._id} value={address._id}>
                          {address.name} - {address.city}, {address.details}
                        </option>
                      ))}
                    </select>
                    {errors.address && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.address}
                      </p>
                    )}
                  </div>
                )}

                {/* New Address Option */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="newAddress"
                    checked={useNewAddress}
                    onChange={(e) => {
                      setUseNewAddress(e.target.checked)
                      setSelectedAddressId('')
                      // Clear phone when switching to new address
                      if (e.target.checked) {
                        setFormData((prev) => ({...prev, phone: ''}))
                      }
                      if (errors.address) {
                        setErrors((prev) => ({...prev, address: ''}))
                      }
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor="newAddress"
                    className="text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    Add a new address
                  </label>
                </div>

                {/* New Address Form */}
                {useNewAddress && (
                  <div className="space-y-4 pl-6 border-l-2 border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                          errors.city ? 'border-rose-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-rose-500">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none ${
                          errors.address
                            ? 'border-rose-500'
                            : 'border-slate-300'
                        }`}
                        placeholder="Enter your full address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-rose-500">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                )}

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

              {/* Card Payment Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <FiCreditCard className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Secure Card Payment
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      You will be redirected to our secure payment gateway to
                      complete your transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mobile-cart-checkout"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin w-4 h-4" />
                    Processing Payment...
                  </span>
                ) : (
                  'Proceed to Payment'
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
