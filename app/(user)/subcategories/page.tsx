'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {getSubCategories, SubCategory} from '../../_api/subcategories'

export default function SubCategories() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchSubCategories = async () => {
      try {
        const data = await getSubCategories()
        if (!mounted) return
        setSubcategories(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading subcategories. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchSubCategories()

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
              SubCategories
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Explore all available subcategories.
            </p>
          </div>
        </header>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && (
          <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/subcategories/${sub._id}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-1 block"
              >
                <article>
                  <div className="p-4 flex flex-col gap-2">
                    <h2
                      className="text-lg font-semibold truncate text-slate-900"
                      title={sub.name}
                    >
                      {sub.name}
                    </h2>
                    <p className="text-xs text-emerald-500/80 truncate">
                      {sub.slug}
                    </p>
                  </div>
                </article>
              </Link>
            ))}

            {subcategories.length === 0 && (
              <div className="col-span-full text-center text-slate-300 text-sm py-10">
                No subcategories available at the moment.
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
