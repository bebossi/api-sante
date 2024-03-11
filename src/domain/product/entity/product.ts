import { Category } from './category'
import { ToppingModel } from './topping'

export type ProductModel = {
  id: string
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
  category: Category
  toppings: ToppingModel[]
  createdAt: Date
  updatedAt: Date
}
