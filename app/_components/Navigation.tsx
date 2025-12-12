'use client'

import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {useState} from 'react'
import {
  FiShoppingCart,
  FiUser,
  FiHome,
  FiPackage,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
  FiHeart
} from 'react-icons/fi'
import {useRealtimeCart, useRealtimeWishlist} from '@/app/_hooks/use-api-query'
import SearchBar from './SearchBar'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const {cartCount} = useRealtimeCart()
  const {wishlistCount} = useRealtimeWishlist()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      // Use NextAuth signOut
      const {signOut} = await import('next-auth/react')
      await signOut({callbackUrl: '/login'})
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const navigationItems = [
    {href: '/', label: 'Home', icon: FiHome},
    {href: '/products', label: 'Products', icon: FiPackage},
    {href: '/categories', label: 'Categories', icon: FiGrid},
    {href: '/brands', label: 'Brands', icon: FiGrid},
    {href: '/wishlist', label: 'Wishlist', icon: FiHeart, badge: wishlistCount},
    {href: '/cart', label: 'Cart', icon: FiShoppingCart, badge: cartCount},
    {href: '/profile', label: 'Profile', icon: FiUser}
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl text-slate-900">Needful</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && item.badge >= 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            {/* Search Bar - Mobile */}
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
