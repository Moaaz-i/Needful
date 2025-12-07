'use client'

import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import getCategories from '../_api/categories'
import {Product} from '@/types'
import {getAllProducts} from '../_api/products'
import {useState, useEffect} from 'react'
import {Category} from '../_api/categories'
import {ProductCard} from '../_components/product-card'
import {Pagination, Autoplay} from 'swiper/modules'
import Link from 'next/link'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getAllProducts()
        ])
        setCategories(categoriesRes.data || [])
        setProducts(productsRes.data || [])
      } catch (err: any) {
        console.log(err)
        setError(err.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className=" bg-slate-50">
      <section className="border-b border-amber-100 bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-[1.3fr,1fr] items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
              Online store
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Welcome to Needful
            </h1>
            <p className="text-lg text-slate-600">
              Your trusted online shopping destination for quality products and
              great deals.
            </p>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              Discover trending categories and handpicked products with fast
              checkout and a smooth shopping experience.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-400 transition"
              >
                Start shopping
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white/60 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                Browse categories
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <div className="relative h-52 w-full max-w-xs rounded-3xl bg-white shadow-lg border border-amber-100 overflow-hidden flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
                <i className="fa-solid fa-cart-shopping text-3xl text-rose-500" />
              </div>
              <span className="absolute bottom-4 left-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                New arrivals
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 bg-amber-50/40 border-b border-amber-100">
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={16}
          className="!w-full"
          loop={true}
          pagination={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          modules={[Pagination, Autoplay]}
        >
          {isLoading
            ? // Loading skeleton for categories
              [...Array(5)].map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`} className="w-auto!">
                  <div className="w-64 md:w-72 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
                    <div className="h-96 w-full bg-linear-to-br from-slate-200 to-slate-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : categories.map((category) => (
                <SwiperSlide key={category._id} className="w-auto!">
                  <Link
                    key={category._id}
                    href={`/categories/${category._id}`}
                    className="group w-64 md:w-72 relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 block"
                  >
                    {category.image && (
                      <div className="h-96 w-full overflow-hidden bg-slate-100">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-90"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-slate-800 line-clamp-1">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}

          {!isLoading && categories.length === 0 && (
            <SwiperSlide>
              <div className="col-span-full text-center text-slate-600 text-sm py-10">
                No categories available at the moment.
              </div>
            </SwiperSlide>
          )}

          {error && (
            <SwiperSlide>
              <div className="col-span-full text-center text-red-600 text-sm py-10">
                {error}
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <section className="max-w-6xl mx-auto px-4 pt-10 pb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Featured products
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            A curated selection of products picked just for you.
          </p>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-500"
        >
          View all
          <span className="inline-block translate-y-[1px]">→</span>
        </Link>
      </section>

      <div className="w-full flex justify-center px-4 pb-10">
        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>
          )
        )}
      </div>
    </div>
  )
}
