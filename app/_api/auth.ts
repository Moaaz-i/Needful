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
  try {
    const response = await api.get('/auth/verifyToken')
    console.log('Verify token response:', response.data)

    // Check if response.data is empty or doesn't have user data
    if (!response.data || Object.keys(response.data).length === 0) {
      console.error('Empty response from verifyToken')
      throw new Error('Invalid token or expired session')
    }

    // Handle different response structures
    let userData = response.data
    if (response.data.data && response.data.data.user) {
      // If response has nested structure: { data: { user: {...} } }
      userData = response.data.data
    } else if (response.data.user) {
      // If response has direct user: { user: {...} }
      userData = response.data
    } else if (
      response.data.decoded &&
      (response.data.decoded.id ||
        response.data.decoded.name ||
        response.data.decoded.email)
    ) {
      // If response has decoded user: {message: 'verified', decoded: {...}}
      userData = {message: 'User found', user: response.data.decoded}
    } else if (response.data.id || response.data.name || response.data.email) {
      // If response is the user object directly: { id: "...", name: "...", email: "..." }
      userData = {message: 'User found', user: response.data}
    } else {
      console.error('Unexpected response structure:', response.data)
      throw new Error('Unable to parse user data')
    }

    return userData
  } catch (error) {
    console.error('Verify token error:', error)
    throw error
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const response = await verifyToken()
    console.log('getUserProfile response:', response)

    if (!response || !response.user) {
      console.error('No user data in response:', response)
      throw new Error('No user data found')
    }

    return response.user
  } catch (error) {
    console.error('getUserProfile error:', error)
    throw error
  }
}
