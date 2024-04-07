import { ToppingModel } from '@domain/product/entity/topping'

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  toppings: ToppingModel[]
}
