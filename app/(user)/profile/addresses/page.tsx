'use client'

import {useEffect, useState} from 'react'
import {getAddresses, Address, deleteAddress} from '@/app/_api/addresses'
import {toast} from 'react-hot-toast'
import Link from 'next/link'
import {FiEdit2, FiTrash2, FiPlus, FiArrowRight} from 'react-icons/fi'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAddresses = async () => {
    try {
      const {data} = await getAddresses()
      setAddresses(data)
    } catch (error) {
      toast.error('Error fetching addresses')
      console.error('Error fetching addresses:', error)
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
        console.error('Error deleting address:', error)
      }
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-40"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Link
          href="/profile/addresses/new"
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
        >
          <FiPlus /> Add New Address
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No addresses saved yet</p>
          <Link
            href="/profile/addresses/new"
            className="text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1"
          >
            Add New Address <FiArrowRight className="mt-0.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-lg">{address.name}</h3>
                <div className="flex gap-2">
                  <Link
                    href={`/profile/addresses/edit/${address._id}`}
                    className="text-gray-500 hover:text-rose-500"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => address._id && handleDelete(address._id)}
                    className="text-gray-500 hover:text-rose-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{address.details}</p>
              <p className="text-gray-600 mb-2">{address.city}</p>
              <p className="text-gray-600">{address.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
