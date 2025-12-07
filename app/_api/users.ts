import Api from './api'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// Get current user profile
export const getCurrentUser = async () => {
  const api = Api()
  const {data} = await api.get<User>('/auth/verifyToken')
  return data
}

// Update user profile
export const updateProfile = async (userData: UpdateProfileData) => {
  const api = Api()
  const {data} = await api.put<User>('/users/profile', userData)
  return data
}

// Change password
export const changePassword = async (passwordData: ChangePasswordData) => {
  const api = Api()
  const {data} = await api.put<{message: string}>(
    '/users/change-password',
    passwordData
  )
  return data
}

// Delete user account
export const deleteAccount = async () => {
  const api = Api()
  const {data} = await api.delete<{message: string}>('/users/account')
  return data
}
