'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import Link from 'next/link'
import {getBrandById, Brand} from '../../../_api/brands'
import {getProductsByCategory} from '../../../_api/products'

export default function BrandDetails() {
  const params = useParams()
  const id = (params as {id?: string})?.id

  const [brand, setBrand] = useState<Brand | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchBrand = async () => {
      try {
        const data = await getBrandById(id)
        if (!mounted) return
        setBrand(data)
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading brand details. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchBrand()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center text-xs">
              ←
            </span>
            <span>Back to brands</span>
          </Link>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && brand && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
            <div className="h-56 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src={brand.image}
                alt={brand.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-slate-900">
                {brand.name}
              </h1>
            </div>
          </section>
        )}

        {!error && !brand && (
          <div className="text-center text-slate-500 text-sm py-10">
            Brand not found.
          </div>
        )}
      </div>
    </main>
  )
}
