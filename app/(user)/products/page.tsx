'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {getAllProducts, Product} from '../../_api/products'
import {addToCart} from '../../_api/cart'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        if (!mounted) return
        setProducts(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading products. Please try again later.'
        )
      } finally {
        if (!mounted) return
      }
    }

    fetchProducts()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
              Catalog
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              All products
            </h1>
            <p className="mt-2 text-slate-600 text-sm md:text-base">
              Browse all products available in the store and add your favorites
              to the cart.
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
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-1 block"
              >
                <article>
                  <div className="h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-90"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <h2
                      className="text-sm font-semibold line-clamp-2"
                      title={product.title}
                    >
                      {product.title}
                    </h2>
                    <p className="text-rose-500 font-semibold text-sm">
                      {product.price} EGP
                    </p>
                    {product.ratingsAverage && (
                      <p className="text-xs text-slate-500">
                        Rating: {product.ratingsAverage.toFixed(1)} / 5
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault()
                        try {
                          setAddingId(product._id)
                          await addToCart(product._id)
                        } finally {
                          setAddingId(null)
                        }
                      }}
                      disabled={addingId === product._id}
                      className="mt-2 inline-flex items-center justify-center rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {addingId === product._id ? 'Adding...' : 'Add to cart'}
                    </button>
                  </div>
                </article>
              </Link>
            ))}

            {products.length === 0 && (
              <div className="col-span-full text-center text-slate-300 text-sm py-10">
                No products available at the moment.
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
