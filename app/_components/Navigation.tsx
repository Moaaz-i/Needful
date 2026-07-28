'use client'

import {
  useRealtimeCart,
  useRealtimeWishlist,
} from "@/app/_hooks/use-api-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiGrid,
  FiHeart,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiShoppingCart,
  FiUser,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import SearchBar from "./SearchBar";

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const {data: session, status} = useSession()
  const {cartCount} = useRealtimeCart()
  const {wishlistCount} = useRealtimeWishlist()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAuthenticated = status === 'authenticated'

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react");
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      router.push("/auth/login");
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  // Public navigation items (visible to everyone)
  const publicItems = [
    {href: '/', label: 'Home', icon: FiHome},
    {href: '/products', label: 'Products', icon: FiPackage},
    {href: '/categories', label: 'Categories', icon: FiGrid},
    {href: '/brands', label: 'Brands', icon: FiGrid}
  ]

  // Auth-only navigation items
  const authItems = [
    {href: '/wishlist', label: 'Wishlist', icon: FiHeart, badge: wishlistCount},
    {href: '/cart', label: 'Cart', icon: FiShoppingCart, badge: cartCount},
    {href: '/profile', label: 'Profile', icon: FiUser}
  ]

  const navigationItems = isAuthenticated
    ? [...publicItems, ...authItems]
    : publicItems

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
            {navigationItems.map(
              (item: {
                href: string;
                label: string;
                icon: React.ComponentType<{ className: string }>;
                badge?: number;
              }) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-rose-50 text-rose-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {"badge" in item && item.badge !== undefined && (
                      <span className="ml-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              },
            )}

            {/* Auth actions */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all"
                >
                  <FiLogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all shadow-sm hover:shadow-md"
                >
                  <FiUserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
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
              {navigationItems.map(
                (item: {
                  href: string;
                  label: string;
                  icon: React.ComponentType<{ className: string }>;
                  badge?: number;
                }) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-rose-50 text-rose-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {"badge" in item && item.badge !== undefined && (
                        <span className="ml-auto bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                },
              )}

              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all"
                  >
                    <FiLogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all"
                  >
                    <FiUserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
