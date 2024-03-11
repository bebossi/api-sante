import { Order } from '../../order/entity/order'
import { Address } from './address'

export type AccountModel = {
  id: string
  name: string
  email: string
  password: string
  role: string
  addressess: Address[]
  orders: Order[]
}
