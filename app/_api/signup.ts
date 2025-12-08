import Api from './api'
import {apiEndpoints} from '@/lib/config'

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

export async function signup(
  payload: SignupPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  const api = Api(customBaseUrl)

  const res = await api.post<AuthResponse>('/auth/signup', payload)
  return res.data
}

export async function login(
  payload: LoginPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  const baseUrl =
    customBaseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const loginUrl = baseUrl
    ? `${baseUrl}/api/v1/auth/signin`
    : apiEndpoints.auth.signin

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function loginWithProxy(
  payload: LoginPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  const api = Api(customBaseUrl)
  const res = await api.post<AuthResponse>('/auth/signin', payload)
  return res.data
}
