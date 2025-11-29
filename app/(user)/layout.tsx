'use client'

import {ReactNode, useEffect} from 'react'
import {usePathname, useRouter} from 'next/navigation'

export default function UserLayout({children}: {children: ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const isAuthPage = pathname === '/login' || pathname === '/signup'

    const isAuth = token !== null

    if (!isAuth && !isAuthPage) {
      router.replace('/login')
      return
    }

    if (isAuth && isAuthPage) {
      router.replace('/')
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
}
