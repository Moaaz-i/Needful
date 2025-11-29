import Api from './api'

export type Product = {
  _id: string
  title: string
  price: number
  imageCover: string
  ratingsAverage?: number
}

type ProductsResponse = {
  data: Product[]
}

export async function getAllProducts(): Promise<ProductsResponse> {
  const api = Api()

  try {
    const res = await api.get<ProductsResponse>('/products')
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getProductsByCategory(
  categoryId: string
): Promise<ProductsResponse> {
  const api = Api()

  try {
    const res = await api.get<ProductsResponse>('/products', {
      params: {category: categoryId}
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export async function getProductById(id: string): Promise<Product> {
  const api = Api()

  try {
    const res = await api.get<{data: Product}>(`/products/${id}`)
    return res.data.data
  } catch (error) {
    throw error
  }
}
