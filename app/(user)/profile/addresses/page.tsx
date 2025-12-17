'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {getAddresses, Address, deleteAddress} from '@/app/_api/addresses'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiHome
} from 'react-icons/fi'

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAddresses = async () => {
    try {
      const {data} = await getAddresses()
      setAddresses(data)
    } catch (error) {
      toast.error('Error fetching addresses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id)
        toast.success('Address deleted successfully')
        fetchAddresses()
      } catch (error) {
        toast.error('Error deleting address')
      }
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-linear-to-r from-rose-500 to-rose-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    My Addresses
                  </h1>
                  <p className="text-rose-100">
                    Manage your shipping addresses
                  </p>
                </div>
              </div>
              <Link
                href="/profile/addresses/new"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add New Address
              </Link>
            </div>
          </div>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <FiMapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No addresses saved yet
            </h3>
            <p className="text-slate-600 mb-6">
              Add your first address to make checkout faster
            </p>
            <Link
              href="/profile/addresses/new"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Your First Address
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                        <FiHome className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {address.name}
                        </h3>
                        <p className="text-sm text-slate-500">Default</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/profile/addresses/edit/${address._id}`}
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4 text-slate-600" />
                      </Link>
                      <button
                        onClick={() => address._id && handleDelete(address._id)}
                        className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-slate-700 text-sm">
                        {address.details}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-4 h-4 text-slate-400 shrink-0" />
                      <p className="text-slate-700 text-sm">{address.phone}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-slate-600 text-sm font-medium">
                        {address.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
