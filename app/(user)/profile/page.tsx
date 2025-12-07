'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import {toast} from 'react-hot-toast'
import {getCurrentUser, updateProfile, User} from '@/app/_api/users'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut
} from 'react-icons/fi'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const {data: session, status} = useSession()
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use NextAuth session instead of localStorage
        if (status !== 'authenticated') {
          router.push('/login')
          return
        }

        const userData = await getCurrentUser()
        setProfile(userData)
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || ''
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchProfile()
    }
  }, [router, session, status])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(formData)
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleLogout = async () => {
    try {
      // Use NextAuth signOut instead of localStorage
      const {signOut} = await import('next-auth/react')
      await signOut({callbackUrl: '/login'})
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Profile not found
          </h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-rose-100">Manage your account information</p>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-white text-rose-500 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <FiSave className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Profile Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FiUser className="inline w-4 h-4 mr-2" />
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({...formData, name: e.target.value})
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-4 py-2 rounded-lg">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-2" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({...formData, email: e.target.value})
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-4 py-2 rounded-lg">
                        {profile.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FiPhone className="inline w-4 h-4 mr-2" />
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({...formData, phone: e.target.value})
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Add phone number"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-4 py-2 rounded-lg">
                        {profile.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FiCalendar className="inline w-4 h-4 mr-2" />
                      Member Since
                    </label>
                    <p className="text-slate-900 bg-slate-50 px-4 py-2 rounded-lg">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Quick Actions
                </h2>

                <div className="space-y-3">
                  <Link
                    href="/profile/addresses"
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        Manage Addresses
                      </span>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Link>

                  <Link
                    href="/cart"
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        View Cart
                      </span>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        Browse Products
                      </span>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Link>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
