import './globals.css'
import ErrorBoundary from './_components/ErrorBoundary'
import {Toaster} from 'react-hot-toast'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'
import {AuthProvider} from './_components/auth-provider'
import {GlobalStateProvider} from './_contexts/global-state-context'
import {NotificationSystem} from './_components/notification-system'
import {SyncStatus} from './_components/sync-status'
import {QueryProvider} from './_providers/query-provider'
import AutoRefreshWrapper from './_components/auto-refresh-wrapper'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className="bg-slate-50 text-slate-900">
        <ErrorBoundary>
          <QueryProvider>
            <AutoRefreshWrapper>
              <GlobalStateProvider>
                <AuthProvider>
                  {children}
                  <NotificationSystem />
                  <SyncStatus />
                </AuthProvider>
              </GlobalStateProvider>
            </AutoRefreshWrapper>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
