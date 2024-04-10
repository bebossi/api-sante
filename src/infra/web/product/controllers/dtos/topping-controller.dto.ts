export interface CreateToppingRequest {
  name: string
  description: string
  image: string
  price: number
  productId: string
}

export interface CreateToppingResponse {
  message: string
}
