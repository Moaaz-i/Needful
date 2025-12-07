import Api from './api'

export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  addresses?: any[]
  createdAt: string
  updatedAt: string
}

export interface VerifyTokenResponse {
  message: string
  user: User
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  const api = Api()
  const response = await api.get('/auth/verifyToken')
  return response.data
}

export async function getUserProfile(): Promise<User> {
  const response = await verifyToken()
  return response.user
}
