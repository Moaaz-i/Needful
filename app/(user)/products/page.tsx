'use client'

import {useEffect, useState, useMemo, useCallback} from 'react'
import Link from 'next/link'

import {Product} from '@/types'
import {addToCart} from '../../_api/cart'
import {FiFilter, FiX, FiChevronDown, FiSearch} from 'react-icons/fi'
import {ProductCard} from '@/app/_components/product-card'
import {useSearchParams, useRouter, usePathname} from 'next/navigation'
import {
  useProducts,
  useSubcategories,
  useAutoRefreshAll
} from '../../_hooks/use-api-query'
import {Subcategory} from '@/app/_api/products'
type FilterOptions = {
  category: string[]
  subcategory: string[]
  brand: string[]
  minPrice: string
  maxPrice: string
  inStock: boolean
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'
  search: string
}

export default function Products() {
  const [error, setError] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categories, setCategories] = useState<{_id: string; name: string}[]>(
    []
  )
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([])
  const [brands, setBrands] = useState<{_id: string; name: string}[]>([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Call hooks at component level
  const productsQuery = useProducts()
  const subcategoriesQuery = useSubcategories()

  // Enable auto-refresh for all data
  useAutoRefreshAll()

  // Use data directly from hooks
  const products = productsQuery.data || []
  const subcategories = subcategoriesQuery.data || []
  const isLoading = productsQuery.isLoading || subcategoriesQuery.isLoading

  // Initialize filters from URL or use defaults
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category')?.split(',') || [],
    subcategory: searchParams.get('subcategory')?.split(',') || [],
    brand: searchParams.get('brand')?.split(',') || [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'newest',
    search: searchParams.get('search') || ''
  })

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: FilterOptions) => {
      const params = new URLSearchParams()

      if (newFilters.category.length > 0) {
        params.set('category', newFilters.category.join(','))
      }
      if (newFilters.subcategory.length > 0) {
        params.set('subcategory', newFilters.subcategory.join(','))
      }
      if (newFilters.brand.length > 0) {
        params.set('brand', newFilters.brand.join(','))
      }
      if (newFilters.minPrice) {
        params.set('minPrice', newFilters.minPrice)
      }
      if (newFilters.maxPrice) {
        params.set('maxPrice', newFilters.maxPrice)
      }
      if (newFilters.inStock) {
        params.set('inStock', 'true')
      }
      if (newFilters.sortBy && newFilters.sortBy !== 'newest') {
        params.set('sortBy', newFilters.sortBy)
      }
      if (newFilters.search) {
        params.set('search', newFilters.search)
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router]
  )

  // Handle filter changes
  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    const newFilters = {...filters, [name]: value}
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Toggle category filter
  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.category.includes(categoryId)
      ? filters.category.filter((id) => id !== categoryId)
      : [...filters.category, categoryId]
    handleFilterChange('category', newCategories)
  }

  // Toggle subcategory filter
  const toggleSubcategory = (subcategoryId: string) => {
    const newSubcategories = filters.subcategory.includes(subcategoryId)
      ? filters.subcategory.filter((id) => id !== subcategoryId)
      : [...filters.subcategory, subcategoryId]
    handleFilterChange('subcategory', newSubcategories)
  }

  // Toggle brand filter
  const toggleBrand = (brandId: string) => {
    const newBrands = filters.brand.includes(brandId)
      ? filters.brand.filter((id) => id !== brandId)
      : [...filters.brand, brandId]
    handleFilterChange('brand', newBrands)
  }

  // Extract unique categories and brands
  useEffect(() => {
    const uniqueCategories = new Map()
    const uniqueBrands = new Map()

    products.forEach((product: any) => {
      if (product.category && !uniqueCategories.has(product.category._id)) {
        uniqueCategories.set(product.category._id, {
          _id: product.category._id,
          name: product.category.name
        })
      }

      if (product.brand && !uniqueBrands.has(product.brand._id)) {
        uniqueBrands.set(product.brand._id, {
          _id: product.brand._id,
          name: product.brand.name
        })
      }
    })

    setCategories(Array.from(uniqueCategories.values()))
    setBrands(Array.from(uniqueBrands.values()))
  }, [products])

  // Update filtered subcategories when category filter changes
  useEffect(() => {
    if (filters.category.length > 0) {
      const filtered = subcategories.filter((subcat: Subcategory) =>
        filters.category.includes(subcat.category)
      )
      setFilteredSubcategories(filtered)

      // If the current subcategory selection includes subcategories not in the filtered list, remove them
      const validSubcategories = filters.subcategory.filter((subId) =>
        filtered.some((sub: Subcategory) => sub._id === subId)
      )

      if (validSubcategories.length !== filters.subcategory.length) {
        setFilters((prev) => ({...prev, subcategory: validSubcategories}))
      }
    } else {
      setFilteredSubcategories(subcategories)
    }
  }, [filters.category, subcategories, filters.subcategory])

  // Apply filters and sorting - computed value
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply category filter
    if (filters.category.length > 0) {
      result = result.filter(
        (product) =>
          product.category && filters.category.includes(product.category._id)
      )
    }

    // Apply subcategory filter
    if (filters.subcategory.length > 0) {
      result = result.filter(
        (product) =>
          product.subcategory &&
          product.subcategory.some((sub: any) =>
            filters.subcategory.includes(sub._id)
          )
      )
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      result = result.filter(
        (product) => product.brand && filters.brand.includes(product.brand._id)
      )
    }

    // Apply price range filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice)
      result = result.filter((product) => product.price >= min)
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice)
      result = result.filter((product) => product.price <= max)
    }

    // Apply in-stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.quantity > 0)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return (b.ratingsAverage || 0) - (a.ratingsAverage || 0)
        case 'newest':
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
    })

    return result
  }, [products, filters])

  // Calculate price range for the price filter
  const priceRange = useMemo(() => {
    if (products.length === 0) return {min: 0, max: 1000}
    const prices = products.map((p: Product) => p.price)
    return {
      min: Math.floor(Math.min(...prices) / 100) * 100, // Round down to nearest 100
      max: Math.ceil(Math.max(...prices) / 100) * 100 // Round up to nearest 100
    }
  }, [products])

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      category: [],
      subcategory: [],
      brand: [],
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest',
      search: ''
    }
    setFilters(defaultFilters)
    updateURL(defaultFilters)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="text-center mb-6 md:mb-12 mobile-card mobile-safe-top">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl mb-6 mobile-shadow">
            <i className="fa-solid fa-store text-2xl md:text-3xl text-rose-500"></i>
          </div>
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-rose-500 font-semibold mb-3">
            Premium Collection
          </p>
          <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3 md:mb-4 mobile-text">
            Discover Amazing Products
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mobile-text">
            Browse our curated collection of high-quality products with
            exclusive offers
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-3 py-3 bg-white border border-slate-200 rounded-xl mobile-card mobile-shadow hover:shadow-lg mobile-transition mobile-button"
          >
            <FiFilter className="text-rose-500" />
            <span className="font-medium">Filters</span>
            {(filters.category.length > 0 ||
              filters.subcategory.length > 0 ||
              filters.brand.length > 0 ||
              filters.search) && (
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full mobile-badge">
                {filters.category.length +
                  filters.subcategory.length +
                  filters.brand.length +
                  (filters.search ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sidebar Filters */}
          <aside
            className={`${
              isFilterOpen ? 'block' : 'hidden'
            } lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <div className="bg-white p-3 md:p-6 rounded-2xl border border-slate-200 mobile-shadow-lg sticky top-6 mobile-card mobile-filter">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium mobile-transition"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Search Products
                </label>
                <div className="relative mobile-search">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    placeholder="Search for products..."
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 mobile-form mobile-price-input"
                  />
                  <FiSearch className="absolute right-4 top-4 text-slate-400 mobile-search-icon" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Categories
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto mobile-grid mobile-scroll">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center mobile-list-item"
                    >
                      <input
                        type="checkbox"
                        id={`cat-${category._id}`}
                        checked={filters.category.includes(category._id)}
                        onChange={() => toggleCategory(category._id)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 mobile-checkbox"
                      />
                      <label
                        htmlFor={`cat-${category._id}`}
                        className="ml-3 text-sm text-slate-700 cursor-pointer mobile-text mobile-touch"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Subcategories
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto mobile-grid mobile-scroll">
                  {filteredSubcategories.map((subcategory) => (
                    <div
                      key={subcategory._id}
                      className="flex items-center mobile-list-item"
                    >
                      <input
                        type="checkbox"
                        id={`subcat-${subcategory._id}`}
                        checked={filters.subcategory.includes(subcategory._id)}
                        onChange={() => toggleSubcategory(subcategory._id)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 mobile-checkbox"
                      />
                      <label
                        htmlFor={`subcat-${subcategory._id}`}
                        className="ml-3 text-sm text-slate-700 cursor-pointer mobile-text mobile-touch"
                      >
                        {subcategory.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Brands
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto mobile-grid mobile-scroll">
                  {brands.map((brand) => (
                    <div
                      key={brand._id}
                      className="flex items-center mobile-list-item"
                    >
                      <input
                        type="checkbox"
                        id={`brand-${brand._id}`}
                        checked={filters.brand.includes(brand._id)}
                        onChange={() => toggleBrand(brand._id)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 mobile-checkbox"
                      />
                      <label
                        htmlFor={`brand-${brand._id}`}
                        className="ml-3 text-sm text-slate-700 cursor-pointer mobile-text mobile-touch"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Price Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">
                      Min
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange('minPrice', e.target.value)
                      }
                      placeholder={priceRange.min.toString()}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 mobile-form"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">
                      Max
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', e.target.value)
                      }
                      placeholder={priceRange.max.toString()}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 mobile-form"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Availability
                </h3>
                <div className="flex items-center mobile-list-item">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange('inStock', e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 mobile-checkbox"
                  />
                  <label
                    htmlFor="inStock"
                    className="ml-3 text-sm text-slate-700 cursor-pointer mobile-text mobile-touch"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Sort By
                </h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange(
                      'sortBy',
                      e.target.value as FilterOptions['sortBy']
                    )
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 mobile-form"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900 mobile-text">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'Product' : 'Products'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {filteredProducts.length === 0
                    ? 'No products found'
                    : `Showing ${Math.min(filteredProducts.length, 12)} of ${
                        filteredProducts.length
                      }`}
                </p>
              </div>

              {/* Mobile sort */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 mobile-card">
                <label className="text-sm text-slate-700 whitespace-nowrap">
                  Sort:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange(
                      'sortBy',
                      e.target.value as FilterOptions['sortBy']
                    )
                  }
                  className="text-sm border-0 focus:ring-0 bg-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="rating-desc">Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse h-[400px] flex flex-col"
                  >
                    <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mb-4 mobile-card flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2 mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-8 text-center mobile-card">
                <i className="fa-solid fa-exclamation-triangle text-3xl mb-4"></i>
                <p className="font-medium">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 mobile-card">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                  <i className="fa-solid fa-search text-3xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 mobile-transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
