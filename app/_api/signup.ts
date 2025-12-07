import Api from './api'

export type SignupPayload = {
  name: string
  email: string
  password: string
  rePassword: string
  phone: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  message: string
  token: string
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const api = Api()

  const res = await api.post<AuthResponse>('/auth/signup', payload)
  return res.data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(
    'https://ecommerce.routemisr.com/api/v1/auth/signin',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function loginWithProxy(
  payload: LoginPayload
): Promise<AuthResponse> {
  const api = Api()
  const res = await api.post<AuthResponse>('/auth/signin', payload)
  return res.data
}
