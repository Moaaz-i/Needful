'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import Link from 'next/link'
import {getCategoryById, Category} from '../../../_api/categories'
import {
  getSubCategoryByCategoryId,
  SubCategory
} from '../../../_api/subcategories'

export default function CategoryDetails() {
  const params = useParams()
  const id = params?.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchData = async () => {
      try {
        const [categoryData, subCategoriesData] = await Promise.all([
          getCategoryById(id),
          getSubCategoryByCategoryId(id)
        ])

        if (!mounted) return
        setCategory(categoryData)
        setSubCategories(subCategoriesData.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading category details. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center text-xs">
              ←
            </span>
            <span>Back to categories</span>
          </Link>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && category && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
            {category.image && (
              <div className="h-2/4 w-full overflow-hidden bg-slate-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 flex flex-col gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  {category.name}
                </h1>
                {category.slug && (
                  <p className="mt-1 text-sm text-emerald-500/90">
                    /{category.slug}
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-600">
                Here you can explore all products and information related to
                this category.
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 border border-rose-100 text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Category details
                </span>
              </div>
            </div>
          </section>
        )}

        {!error && subCategories.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-slate-900">
              SubCategories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subCategories.map((subCategory) => (
                <Link
                  key={subCategory._id}
                  href={`/subcategories/${subCategory._id}`}
                  className="group rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition duration-300 block"
                >
                  <article>
                    <div className="p-4 flex flex-col gap-2">
                      <h3
                        className="text-sm font-semibold line-clamp-2 text-slate-900"
                        title={subCategory.name}
                      >
                        {subCategory.name}
                      </h3>
                      <p className="text-emerald-500 font-semibold text-sm">
                        {subCategory.slug}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!error && !category && (
          <div className="text-center text-slate-500 text-sm py-10">
            Category not found.
          </div>
        )}
      </div>
    </main>
  )
}
