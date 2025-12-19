'use client'

import {useEffect, useState} from 'react'
import {getUserOrders} from '@/app/_api/orders'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck
} from 'react-icons/fi'
import {Order} from '@/app/interfaces'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await getUserOrders()
      console.log('Full API Response:', response)

      setOrders(response?.data)

      console.log(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error loading orders')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusFromOrder = (
    order: Order
  ): 'delivered' | 'processing' | 'pending' | 'shipped' | 'cancelled' => {
    if (order.isDelivered) return 'delivered'
    if (order.isPaid) return 'processing'
    return order.status || 'pending'
  }

  const getStatusColor = (order: Order) => {
    const status = getStatusFromOrder(order)
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50'
      case 'shipped':
        return 'text-blue-600 bg-blue-50'
      case 'processing':
        return 'text-yellow-600 bg-yellow-50'
      case 'pending':
        return 'text-gray-600 bg-gray-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (order: Order) => {
    const status = getStatusFromOrder(order)
    switch (status) {
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />
      case 'shipped':
        return <FiTruck className="w-4 h-4" />
      case 'processing':
        return <FiClock className="w-4 h-4" />
      case 'pending':
        return <FiClock className="w-4 h-4" />
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }

  const getStatusText = (order: Order) => {
    const status = getStatusFromOrder(order)
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
                <h1 className="text-2xl font-bold text-white">My Orders</h1>
                <p className="text-rose-100">Track and manage your orders</p>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <FiPackage className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No orders yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start shopping to see your orders here
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
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Order ID</p>
                        <p className="font-semibold text-slate-900">
                          #{order.id || order._id.slice(-6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-medium text-slate-900">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order
                        )}`}
                      >
                        {getStatusIcon(order)}
                        {getStatusText(order)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.cartItems?.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">
                            {item.product.title}
                          </h4>
                          <p className="text-sm text-slate-500">
                            Qty: {item.count} × {item.price} EGP
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            {item.price * item.count} EGP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiMapPin className="w-4 h-4" />
                        {order.shippingAddress.city || 'City not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiCreditCard className="w-4 h-4" />
                        {order.paymentMethodType === 'card'
                          ? 'Card'
                          : 'Cash on Delivery'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="text-xl font-bold text-rose-500">
                        {order.totalOrderPrice} EGP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
