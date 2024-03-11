import { Order } from '../../order/entity/order'
import { AccountModel } from './account'

export type Address = {
  id: string
  street: string
  neighborhood: string
  streetNumber: number
  complementNumber: number
  CEP: number
  userId: string
  user: AccountModel
  orders: Order[]
}
