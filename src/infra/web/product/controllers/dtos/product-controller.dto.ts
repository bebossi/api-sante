import { Topping, ToppingConstructorProps } from '@domain/product/entity/topping/topping'

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  toppings: ToppingConstructorProps[]
}

export interface GetProductDataRequest {
  productId: string
}
