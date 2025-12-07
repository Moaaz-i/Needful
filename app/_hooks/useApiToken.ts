'use client'

import {useSession} from 'next-auth/react'
import {useEffect} from 'react'

export function useApiToken() {
  const {data: session} = useSession()

  useEffect(() => {
    // Update API interceptor with session token
    const updateApiToken = () => {
      if (session?.accessToken) {
        // Store token in a global variable for API calls
        ;(window as any).__apiToken = session.accessToken
      } else {
        delete (window as any).__apiToken
      }
    }

    updateApiToken()
  }, [session])

  return session?.accessToken
}
