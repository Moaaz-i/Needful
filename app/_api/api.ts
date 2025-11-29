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

export default function Api() {
  const api = axios.create({
    baseURL: 'https://ecommerce.routemisr.com/api/v1',
    headers: {
      'Content-Type': 'application/json',
      token:
        typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
    }
  })

  api.interceptors.request.use((config) => {
    activeRequests += 1
    notifyLoading()
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
