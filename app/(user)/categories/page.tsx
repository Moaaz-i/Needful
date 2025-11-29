'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import getCategories from '../../_api/categories'

type Category = {
  _id: string
  name: string
  image?: string
  slug?: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        if (!mounted) return
        setCategories(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading categories. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchCategories()

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
              Categories
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Explore all available categories and choose what fits your
              products.
            </p>
          </div>
        </header>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && (
          <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 block"
              >
                <article>
                  {category.image && (
                    <div className="h-64 w-full overflow-hidden bg-slate-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-90"
                      />
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-2">
                    <h2
                      className="text-lg font-semibold truncate text-slate-900"
                      title={category.name}
                    >
                      {category.name}
                    </h2>
                    {category.slug && (
                      <p className="text-xs text-rose-500/80">
                        /{category.slug}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 border border-rose-100 text-rose-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Category
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full text-center text-slate-300 text-sm py-10">
                No categories available at the moment.
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
