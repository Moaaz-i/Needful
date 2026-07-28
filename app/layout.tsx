import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import ErrorBoundary from './_components/ErrorBoundary'
import {Toaster, toast} from 'react-hot-toast'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'
import {AuthProvider} from './_components/auth-provider'
import {GlobalStateProvider} from './_contexts/global-state-context'
import {NotificationSystem} from './_components/notification-system'
import {SyncStatus} from './_components/sync-status'
import {QueryProvider} from './_providers/query-provider'
import AutoRefreshWrapper from './_components/auto-refresh-wrapper'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Needful — Everything You Need',
    template: '%s | Needful',
  },
  description:
    'Discover premium products at unbeatable prices. Needful is your one-stop online store for everything you need — from fashion to electronics.',
  keywords: ['ecommerce', 'online shopping', 'Needful', 'premium products', 'fashion', 'electronics'],
  icons: {
    icon: '/needful-icon.png',
    apple: '/needful-icon.png',
  },
  openGraph: {
    title: 'Needful — Everything You Need',
    description:
      'Discover premium products at unbeatable prices. Your one-stop online store.',
    url: 'https://needful.vercel.app',
    siteName: 'Needful',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Needful — Everything You Need',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Needful — Everything You Need',
    description:
      'Discover premium products at unbeatable prices. Your one-stop online store.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <ErrorBoundary>
          <QueryProvider>
            <AutoRefreshWrapper>
              <GlobalStateProvider>
                <AuthProvider>
                  {children}
                  <NotificationSystem />
                  <SyncStatus />
                  <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                    toastOptions={{
                      style: {
                        zIndex: 999999,
                        position: 'fixed'
                      }
                    }}
                  />
                </AuthProvider>
              </GlobalStateProvider>
            </AutoRefreshWrapper>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
