'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {addAddress, Address} from '@/app/_api/addresses'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {FiArrowRight} from 'react-icons/fi'

export default function AddAddressPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<
    Omit<Address, '_id' | 'user' | 'createdAt' | 'updatedAt'>
  >({
    name: 'Home',
    details: '123 Main St, Apt 4B',
    phone: '1234567890',
    city: 'New York'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await addAddress(formData)
      toast.success('Address added successfully')
      router.push('/profile/addresses')
    } catch (error) {
      toast.error('Error adding address')
      console.error('Error adding address:', error)
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
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/profile/addresses"
          className="inline-flex items-center text-rose-500 hover:text-rose-600 mb-4"
        >
          <FiArrowRight className="ml-1 transform rotate-180" /> Back to
          Addresses
        </Link>
        <h1 className="text-2xl font-bold">Add New Address</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-right">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم العنوان
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-right"
            required
          />
        </div>

        <div className="text-right">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تفاصيل العنوان
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-right"
            required
          />
        </div>

        <div className="text-right">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-right"
            required
          />
        </div>

        <div className="text-right">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدينة
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 text-right"
            required
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  )
}
