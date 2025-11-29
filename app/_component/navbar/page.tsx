'use client'
import NavLink from '../navlink/page'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {cn} from '@/lib/utils'

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedToken = window.localStorage.getItem('token')
    setToken(storedToken)
  }, [pathname])

  const isAuth = !!token

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token')
    }
    setToken(null)
    router.replace('/login')
  }

  return (
    <nav className="sticky top-0 z-40 bg-amber-50/80 backdrop-blur border-b border-amber-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <i className="fa-solid fa-xmark text-xl"></i>
            ) : (
              <i className="fa-solid fa-bars text-xl"></i>
            )}
          </button>

          <NavLink
            href="/"
            className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900"
          >
            <i className="fa-solid fa-store text-rose-500 text-3xl"></i>
            <span>Needful</span>
          </NavLink>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl border border-t-0 border-amber-100 overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'
          )}
        >
          <ul className="flex flex-col p-2">
            <NavItem href="/categories">Categories</NavItem>
            <NavItem href="/products">Products</NavItem>
            <NavItem href="/brands">Brands</NavItem>
            <NavItem href="/subcategories">Subcategories</NavItem>
            {!isAuth ? (
              <>
                <div className="border-t border-amber-100 my-2"></div>
                <NavItem href="/login">Login</NavItem>
                <NavItem href="/signup">Sign Up</NavItem>
              </>
            ) : (
              <>
                <div className="border-t border-amber-100 my-2"></div>
                <NavItem href="/cart">
                  <i className="fa-solid fa-cart-shopping mr-2"></i>
                  Cart
                </NavItem>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-3 bg-white/60 px-3 py-4 rounded-2xl shadow-sm border border-amber-100">
          <li>
            <NavLink
              href="/categories"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-amber-100 link-active:bg-amber-200 transition"
            >
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              href="/products"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-amber-100 link-active:bg-amber-200 transition"
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              href="/brands"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-amber-100 link-active:bg-amber-200 transition"
            >
              Brands
            </NavLink>
          </li>
          <li>
            <NavLink
              href="/subcategories"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-amber-100 link-active:bg-amber-200 transition"
            >
              Subcategories
            </NavLink>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <NavLink
            href="/cart"
            className="link-active:text-amber-500 text-rose-500 hidden sm:inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold transition"
          >
            <i className="fa-solid fa-cart-shopping text-xl"></i>
          </NavLink>

          <div className="px-2 py-1">
            {!isAuth ? (
              <div className="flex items-center gap-2">
                <NavLink
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
                >
                  Login
                </NavLink>
                <NavLink
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-700 bg-white/80 hover:bg-emerald-50 transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
                >
                  Signup
                </NavLink>
              </div>
            ) : (
              <button
                onClick={logout}
                className="inline-flex items-center cursor-pointer justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Mobile menu item component
function NavItem({
  href,
  children,
  className = ''
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <li>
      <NavLink
        href={href}
        className={cn(
          'link-active:bg-amber-200 block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-amber-50 rounded-lg transition-colors',
          className
        )}
      >
        {children}
      </NavLink>
    </li>
  )
}
