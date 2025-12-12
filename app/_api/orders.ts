import {apiEndpoints} from '@/lib/config'

export interface OrderData {
  shippingAddress: {
    firstName: string
    lastName: string
    phone: string
    address: string
    city: string
  }
  notes?: string
  paymentMethod: 'cash' | 'card'
}

export interface OrderResponse {
  success: boolean
  data?: {
    _id: string
    totalOrderPrice: number
    status: string
    shippingAddress: OrderData['shippingAddress']
    paymentMethod: string
    createdAt: string
  }
  message?: string
}

export const createOrder = async (
  orderData: OrderData,
  token?: string
): Promise<OrderResponse> => {
  try {
    const authToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

    const response = await fetch(`${apiEndpoints.base}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: authToken || ''
      },
      body: JSON.stringify(orderData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order')
    }

    return data
  } catch (error: any) {
    console.error('Create order error:', error)
    throw error
  }
}

export const getOrders = async (token?: string): Promise<OrderResponse> => {
  try {
    const authToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

    const response = await fetch(`${apiEndpoints.base}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: authToken || ''
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders')
    }

    return data
  } catch (error: any) {
    console.error('Get orders error:', error)
    throw error
  }
}

export interface CheckoutSessionResponse {
  success: boolean
  data?: {
    session: {
      url: string
    }
  }
  message?: string
}

export const createCheckoutSession = async (
  cartId: string,
  returnUrl: string,
  token?: string
): Promise<CheckoutSessionResponse> => {
  try {
    const authToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

    const response = await fetch(
      `${apiEndpoints.orders.checkout}/${cartId}?url=${encodeURIComponent(
        returnUrl
      )}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: authToken || ''
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session')
    }

    return data
  } catch (error: any) {
    console.error('Create checkout session error:', error)
    throw error
  }
}

export interface SendNotificationResponse {
  success: boolean
  message?: string
  data?: {
    sent: boolean
    messageId?: string
  }
}

export const sendOrderNotification = async (
  orderData: OrderData,
  token?: string
): Promise<SendNotificationResponse> => {
  try {
    const authToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

    const response = await fetch(
      `${apiEndpoints.base}/orders/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: authToken || ''
        },
        body: JSON.stringify(orderData)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send notification')
    }

    return data
  } catch (error: any) {
    console.error('Send notification error:', error)
    throw error
  }
}

export const getOrderById = async (
  orderId: string,
  token?: string
): Promise<OrderResponse> => {
  try {
    const authToken =
      token ||
      (typeof window !== 'undefined' ? localStorage.getItem('token') : '')

    const response = await fetch(apiEndpoints.orders.getById(orderId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: authToken || ''
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order')
    }

    return data
  } catch (error: any) {
    console.error('Get order error:', error)
    throw error
  }
}
