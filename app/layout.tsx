import './globals.css'
import Navbar from './_component/navbar/page'
import GlobalLoading from './_component/global-loading'
import {ToastProvider} from './_components/ui/toast-provider'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className="min-h-screen bg-slate-50 text-slate-900"
      >
        <ToastProvider>
          <GlobalLoading />
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
