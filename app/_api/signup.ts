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
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const api = Api()

  const res = await api.post<AuthResponse>('/auth/signup', payload)
  return res.data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const api = Api()

  const res = await api.post<AuthResponse>('/auth/signin', payload)
  return res.data
}
