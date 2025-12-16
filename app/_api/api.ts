import axios from 'axios'
import {config, apiEndpoints, requestTypes} from '@/lib/config'

let activeRequests = 0
const loadingListeners = new Set<(count: number) => void>()

function notifyLoading() {
  for (const listener of loadingListeners) {
    listener(activeRequests)
  }
}

export function subscribeToLoading(listener: (count: number) => void) {
  loadingListeners.add(listener)
  listener(activeRequests)
}

export function unsubscribeFromLoading(listener: (count: number) => void) {
  loadingListeners.delete(listener)
}

export default function Api(baseURL?: string) {
  // Determine the appropriate base URL
  const finalBaseUrl = baseURL || apiEndpoints.proxy.base

  const api = axios.create({
    baseURL: finalBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use((config) => {
    activeRequests += 1
    notifyLoading()

    // Get token only from NextAuth session (no localStorage)
    let globalToken = ''

    // Only get from global variable set by useApiToken hook
    if (typeof window !== 'undefined' && (window as any).__apiToken) {
      globalToken = (window as any).__apiToken
    }

    if (globalToken) {
      config.headers.token = globalToken
    }

    return config
  })

  api.interceptors.response.use(
    (response) => {
      activeRequests -= 1
      notifyLoading()
      return response
    },
    (error) => {
      activeRequests -= 1
      notifyLoading()
      return Promise.reject(error)
    }
  )

  return api
}

// Helper function to determine if endpoint should use proxy or direct API
export function getApiUrl(endpoint: string): string {
  if (requestTypes.auth.includes(endpoint)) {
    return apiEndpoints.auth[endpoint as keyof typeof apiEndpoints.auth]
  }
  return (
    apiEndpoints.proxy[endpoint as keyof typeof apiEndpoints.proxy] ||
    apiEndpoints.proxy.base
  )
}
