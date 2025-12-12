'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {getSubCategoryById, SubCategory} from '../../../_api/subcategories'
import {getProductsByCategory} from '../../../_api/products'
import {Product} from '@/types'
import {ProductCard} from '../../../_components/product-card'
import LoadingSpinner from '../../../_components/LoadingSpinner'

export default function SubCategoryDetails() {
  const params = useParams()
  const id = (params as {id?: string})?.id

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [subData] = await Promise.all([getSubCategoryById(id)])
        if (subData) {
          const productsData = await getProductsByCategory(subData.category)
          if (!mounted) return
          setSubCategory(subData)
          setProducts(productsData.data || [])
        }
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading subcategory details. Please try again later.'
        )
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center text-xs">
              ←
            </span>
            <span>Back to subcategories</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading subcategory details..." />
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!loading && !error && subCategory && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  {subCategory.name}
                </h1>
                <p className="mt-1 text-sm text-emerald-500/90">
                  /{subCategory.slug}
                </p>
              </div>
            </div>
          </section>
        )}

        {!loading && !error && products.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-slate-900">
              Products
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {!loading && !error && !subCategory && (
          <div className="text-center text-slate-500 text-sm py-10">
            Subcategory not found.
          </div>
        )}
      </div>
    </main>
  )
}
