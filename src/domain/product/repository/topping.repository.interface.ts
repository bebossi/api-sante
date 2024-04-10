import { Topping } from '../entity/topping/topping'

export interface IToppingRepository {
  create(product: Topping): Promise<void>
}
