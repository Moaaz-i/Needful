import Api from './api'

export interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface VerifyTokenResponse {
  user: UserProfile
  message: string
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  const api = Api()
  const {data} = await api.get<VerifyTokenResponse>('/auth/verifyToken')
  return data
}

export async function getCurrentUser(): Promise<UserProfile> {
  const result = await verifyToken()
  return result.user
}

// Legacy function for backward compatibility
export default function VerifyToken() {
  const api = Api()
  api
    .get('/auth/verifyToken')
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}
