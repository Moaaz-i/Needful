import axios from 'axios'

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
  const api = axios.create({
    baseURL: baseURL || '/api/proxy',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use((config) => {
    activeRequests += 1
    notifyLoading()

    // Get token from global variable set by useApiToken hook
    const globalToken =
      typeof window !== 'undefined' && (window as any).__apiToken
        ? (window as any).__apiToken
        : ''

    if (globalToken) {
      config.headers.token = globalToken
    }

    // Add custom identifier and move endpoint to query params
    if (config.url) {
      const randomParam = Math.random().toString(36).substring(7)
      config.params = {
        ...config.params,
        endpoint: config.url,
        _custom: randomParam
      }
      config.url = '' // Clear URL since endpoint is now in params
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
