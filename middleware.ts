import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getToken} from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/wishlist',
    '/cart',
    '/order-card',
    '/order-cash',
    '/order-success',
    '/api/orders',
    '/api/wishlist',
    '/api/cart',
    '/api/addresses'
  ]

  // Check if the requested path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Define auth routes that should redirect to profile if already authenticated
  const authRoutes = ['/login', '/signup']

  // Check if the requested path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  try {
    // Get the token from the request
    const token = await getToken({req: request})

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If trying to access auth route while already authenticated, redirect to profile
    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }

    // Allow the request to proceed
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)

    // If there's an error and it's a protected route, redirect to login
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Otherwise, allow the request to proceed
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}
