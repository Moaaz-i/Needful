'use client'

import {useEffect, useState} from 'react'
import {subscribeToLoading, unsubscribeFromLoading} from '../_api/api'

export default function GlobalLoading() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const listener = (value: number) => {
      setCount(value)
    }

    subscribeToLoading(listener)
    return () => {
      unsubscribeFromLoading(listener)
    }
  }, [])

  if (count <= 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm pointer-events-none">
      <div className="h-10 w-10 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
    </div>
  )
}
