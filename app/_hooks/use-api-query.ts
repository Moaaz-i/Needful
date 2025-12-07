'use client'

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'

// Generic query hook
export function useApiQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number
    select?: (data: any) => T
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
    refetchOnReconnect?: boolean
  }
) {
  return useQuery({
    queryKey: key,
    queryFn,
    staleTime: options?.staleTime || 60 * 1000,
    select: options?.select,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
    refetchOnReconnect: options?.refetchOnReconnect
  })
}

// Generic mutation hook
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  invalidateKeys?: string[][]
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({queryKey: key})
        })
      }
    }
  })
}

// Global refresh function
export function useGlobalRefresh() {
  const queryClient = useQueryClient()

  const refreshAll = () => {
    queryClient.invalidateQueries()
  }

  const refreshCart = () => {
    queryClient.invalidateQueries({queryKey: ['cart']})
  }

  const refreshProducts = () => {
    queryClient.invalidateQueries({queryKey: ['products']})
  }

  const refreshCategories = () => {
    queryClient.invalidateQueries({queryKey: ['categories']})
  }

  const refreshBrands = () => {
    queryClient.invalidateQueries({queryKey: ['brands']})
  }

  return {
    refreshAll,
    refreshCart,
    refreshProducts,
    refreshCategories,
    refreshBrands
  }
}

// Cart hooks
export function useCart() {
  return useApiQuery(
    ['cart'],
    () => import('../_api/cart').then((m) => m.getCart()),
    {
      staleTime: 5 * 1000,
      refetchInterval: 3 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    }
  )
}

export function useRealtimeCart() {
  const {data: cartData, isLoading, error, refetch} = useCart()
  const {refreshCart} = useGlobalRefresh()

  // Debug logging
  console.log('Cart data updated:', cartData)
  console.log('Cart count:', cartData?.numOfCartItems)
  console.log('Is loading:', isLoading)

  return {
    cartItems: cartData?.data?.products || [],
    cartCount: cartData?.numOfCartItems || 0,
    isLoading,
    error,
    refreshCart,
    refetch
  }
}

export function useAddToCart() {
  return useApiMutation(
    (productId: string) =>
      import('../_api/cart').then((m) => m.addToCart(productId)),
    [['cart']]
  )
}

export function useRemoveFromCart() {
  return useApiMutation(
    (itemId: string) =>
      import('../_api/cart').then((m) => m.removeCartItem(itemId)),
    [['cart']]
  )
}

export function useUpdateCartItem() {
  return useApiMutation(
    ({id, count}: {id: string; count: number}) =>
      import('../_api/cart').then((m) => m.updateCartItemCount(id, count)),
    [['cart']]
  )
}

// Products hooks
export function useProducts(filters = '') {
  return useApiQuery(
    ['products', filters],
    () => import('../_api/products').then((m) => m.getAllProducts()),
    {
      select: (data) => data?.data || [],
      staleTime: 15 * 1000,
      refetchInterval: 30 * 1000,
      refetchOnWindowFocus: true
    }
  )
}

export function useProduct(id: string) {
  return useApiQuery(
    ['product', id],
    () => import('../_api/products').then((m) => m.getAllProducts()),
    {
      select: (data) => data?.data,
      staleTime: 5 * 60 * 1000
    }
  )
}

// Categories hooks
export function useCategories() {
  return useApiQuery(
    ['categories'],
    () => import('../_api/categories').then((m) => m.default()),
    {
      select: (data) => data?.data || [],
      staleTime: 5 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000
    }
  )
}

// Subcategories hooks
export function useSubcategories() {
  return useApiQuery(
    ['subcategories'],
    () => import('../_api/products').then((m) => m.getAllSubcategories()),
    {
      select: (data) => data?.data || [],
      staleTime: 5 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000
    }
  )
}

// Brands hooks
export function useBrands() {
  return useApiQuery(
    ['brands'],
    () => import('../_api/brands').then((m) => m.getBrands()),
    {
      select: (data) => data?.data || [],
      staleTime: 5 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000
    }
  )
}

// User profile hooks - REMOVED (user.ts doesn't exist)

// Auto-refresh hook for all data
export function useAutoRefreshAll() {
  const {refreshAll} = useGlobalRefresh()

  // Refresh on window focus
  useApiQuery(
    ['auto-refresh'],
    async () => {
      refreshAll()
      return true
    },
    {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 30 * 1000
    }
  )
}
