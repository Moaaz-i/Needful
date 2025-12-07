'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {getBrands, Brand} from '../../_api/brands'

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchBrands = async () => {
      try {
        const data = await getBrands()
        if (!mounted) return
        setBrands(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading brands. Please try again later.'
        )
      } finally {
        if (!mounted) return
        setIsLoading(false)
      }
    }

    fetchBrands()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Brands
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Explore all available brands in the store.
            </p>
          </div>
        </header>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 w-full bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand._id}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-1 block"
                >
                  <article>
                    <div className="h-40 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105 group-hover:opacity-90"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <h2
                        className="text-lg font-semibold truncate text-center text-slate-900"
                        title={brand.name}
                      >
                        {brand.name}
                      </h2>
                    </div>
                  </article>
                </Link>
              ))}

              {brands.length === 0 && (
                <div className="col-span-full text-center text-slate-300 text-sm py-10">
                  No brands available at the moment.
                </div>
              )}
            </section>
          )
        )}
      </div>
    </main>
  )
}
