'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {getProductById, Product} from '../../../_api/products'
import {addToCart} from '../../../_api/cart'

export default function ProductDetails() {
  const params = useParams()
  const id = (params as {id?: string})?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        if (!mounted) return
        setProduct(data)
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading product details. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchProduct()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <span className="h-6 w-6 rounded-full border border-slate-600 flex items-center justify-center text-xs">
              ←
            </span>
            <span>Back</span>
          </button>
        </div>

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {!error && product && (
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-start">
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="h-[480px] w-full overflow-hidden bg-slate-100">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="h-full w-full object-fill"
                />
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-slate-900">
                  {product.title}
                </h1>
                {product.ratingsAverage && (
                  <p className="text-sm text-rose-500">
                    Rating: {product.ratingsAverage.toFixed(1)} / 5
                  </p>
                )}
              </div>

              <p className="text-rose-500 text-2xl font-semibold">
                {product.price} EGP
              </p>

              {addError && (
                <p className="text-xs text-rose-600 mt-1">{addError}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 items-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 border border-rose-100 text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Product details
                </span>
                <button
                  type="button"
                  disabled={adding}
                  onClick={async () => {
                    if (!product) return
                    try {
                      setAddError(null)
                      setAdding(true)
                      await addToCart(product._id)
                    } catch (err: any) {
                      const msg =
                        err?.response?.data?.message ||
                        'Failed to add product to cart. Please try again.'
                      setAddError(msg)
                    } finally {
                      setAdding(false)
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {adding ? 'Adding...' : 'Add to cart'}
                </button>
              </div>
            </section>
          </div>
        )}

        {!error && !product && (
          <div className="text-center text-slate-300 text-sm py-10">
            Product not found.
          </div>
        )}
      </div>
    </main>
  )
}
