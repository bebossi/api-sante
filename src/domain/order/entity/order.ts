import { AccountModel } from '../../account/entity/account'
import { Address } from '../../account/entity/address'
import { ProductModel } from '../../product/entity/product'
import { AvailableAppointment } from './availiableAppointment'

export type Order = {
  id: string
  userId: string
  orderItems: ProductModel[]
  subTotal: number
  total: number
  createdAt: Date
  addressId: string
  isPaid: boolean
  avaliableAppointmentId: string
  status: string
  avaliableAppointment: AvailableAppointment
  address: Address
  user: AccountModel
}
