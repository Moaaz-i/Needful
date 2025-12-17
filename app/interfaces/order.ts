import {Product} from './product'
import {User} from './user'

export interface ShippingAddress {
  details: string
  phone: string
  city: string
  postalCode?: string
}

export interface OrderItem {
  _id: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: string | User
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  totalOrderPrice: number
  paymentMethodType: 'card' | 'cash'
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderResponse {
  status: string
  results: number
  data: Order[]
}

export interface SingleOrderResponse {
  status: string
  data: Order
}

export interface CheckoutSessionData {
  session: {
    url: string
    sessionId: string
  }
}
