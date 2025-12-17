'use client'

import {ReactNode, useEffect} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import {useApiToken} from '@/app/_hooks/useApiToken'
import {ProfileProvider} from '@/app/_components/profile-provider'
import Navigation from '@/app/_components/Navigation'
import Footer from '@/app/_components/Footer'
import useCart from '@/app/hooks/use-cart'

export default function UserLayout({children}: {children: ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const {data: session, status} = useSession()
  const {loadCart} = useCart()

  useEffect(() => {
    if (status === 'authenticated') {
      loadCart()
    }
  }, [status])

  useApiToken()

  useEffect(() => {
    const isAuthPage = pathname === '/login' || pathname === '/signup'

    if (status === 'loading') return

    const isAuthenticated = status === 'authenticated'

    if (!isAuthenticated && !isAuthPage) {
      router.replace('/login')
      return
    }

    if (isAuthenticated && isAuthPage) {
      router.replace('/')
    }
  }, [pathname, router, session, status])

  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="text-center mobile-card mobile-shadow-lg bg-white rounded-2xl p-8 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-rose-500 mx-auto mb-6"></div>
          <p className="text-slate-600 text-sm md:text-base mobile-text">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-rose-50 text-slate-900 flex flex-col">
        {!isAuthPage && <Navigation />}
        <main className={`flex-1 ${!isAuthPage && 'pt-16'}`}>{children}</main>
        {!isAuthPage && <Footer />}
      </div>
    </ProfileProvider>
  )
}
