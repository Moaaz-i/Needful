'use client'

import {useState, useEffect} from 'react'
import {useRouter, useParams} from 'next/navigation'
import {getAddresses, updateAddress, Address} from '@/app/_api/addresses'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiHome,
  FiMapPin,
  FiPhone,
  FiSave,
  FiX
} from 'react-icons/fi'

export default function EditAddressPage() {
  const router = useRouter()
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<
    Omit<Address, 'user' | 'createdAt' | 'updatedAt'>
  >({
    _id: '',
    name: '',
    details: '',
    phone: '',
    city: ''
  })

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const {data} = await getAddresses()
        const address = data.find((addr) => addr._id === id)
        if (address) {
          setFormData(address)
        } else {
          toast.error('Address not found')
          router.push('/profile/addresses')
        }
      } catch (error) {
        router.push('/profile/addresses')
      }
    }

    if (id) {
      fetchAddress()
    }
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData._id) return

    setIsLoading(true)
    try {
      await updateAddress(formData._id, {
        name: formData.name,
        details: formData.details,
        phone: formData.phone,
        city: formData.city
      })
      toast.success('Address updated successfully')
      router.push('/profile/addresses')
    } catch (error) {
      toast.error('Error updating address')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target
    setFormData((prev) => ({...prev, [name]: value}))
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-linear-to-r from-rose-500 to-rose-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/profile/addresses"
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Address</h1>
                <p className="text-rose-100">Update your shipping address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiHome className="inline w-4 h-4 mr-2 text-rose-500" />
                Address Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="e.g., Home, Office, Parents"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-2 text-rose-500" />
                Address Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                placeholder="Street address, apartment number, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiPhone className="inline w-4 h-4 mr-2 text-rose-500" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-2 text-rose-500" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Your city"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/profile/addresses')}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white py-3 px-4 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
