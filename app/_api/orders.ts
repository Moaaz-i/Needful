// Updated orders.ts
import Api from './api'
import {getUserProfile} from './auth'

export interface ShippingAddress {
  details: string
  phone: string
  city: string
  postalCode?: string
}

export interface OrderItem {
  product: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: string
  cartItems: OrderItem[]
  totalOrderPrice: number
  paymentMethod: 'card' | 'cash'
  isPaid: boolean
  isDelivered: boolean
  shippingAddress: ShippingAddress
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderResponse {
  status: string
  results?: number
  data: {
    orders: Order[]
  }
}

export interface SingleOrderResponse {
  status: string
  data: {
    order: Order
  }
}

// Create new order
export const createOrder = async (
  shippingAddress: ShippingAddress,
  paymentMethod: 'card' | 'cash' = 'cash'
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.post('/orders', {
      shippingAddress,
      paymentMethod
    })
    return response.data
  } catch (error: any) {
    console.error('Create order error:', error)
    throw new Error(error.response?.data?.message || 'Failed to create order')
  }
}

// Get user orders
export const getUserOrders = async (): Promise<OrderResponse> => {
  const api = Api()
  try {
    const response = await api.get('/orders/user-orders')
    return response.data
  } catch (error: any) {
    console.error('Get user orders error:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch orders')
  }
}

// Get order by ID
export const getOrderById = async (
  orderId: string
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  } catch (error: any) {
    console.error('Get order error:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch order')
  }
}

// Update order status (admin only)
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.patch(`/orders/${orderId}`, {status})
    return response.data
  } catch (error: any) {
    console.error('Update order status error:', error)
    throw new Error(
      error.response?.data?.message || 'Failed to update order status'
    )
  }
}

// Create checkout session for card payment
export const createCheckoutSession = async (
  cartId: string,
  returnUrl: string
): Promise<{session: {url: string}}> => {
  const api = Api()
  try {
    const response = await api.post(
      `/orders/checkout-session/${cartId}`,
      {},
      {
        params: {url: returnUrl}
      }
    )
    return response.data
  } catch (error: any) {
    console.error('Create checkout session error:', error)
    throw new Error(
      error.response?.data?.message || 'Failed to create checkout session'
    )
  }
}
