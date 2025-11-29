'use client'

import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Product} from '@/types'

interface CartStore {
  items: Product[]
  addItem: (data: Product) => void
  removeItem: (id: string) => void
  removeAll: () => void
}

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item._id === data._id)

        if (existingItem) {
          return
        }

        set({items: [...get().items, data]})
      },
      removeItem: (id: string) => {
        set({items: [...get().items.filter((item) => item._id !== id)]})
      },
      removeAll: () => set({items: []})
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useCart
