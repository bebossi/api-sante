import { Order } from '@domain/order/entity/order'
import Address, { AddressProps } from '@domain/user/entity/address'
import { UserId } from '@domain/user/value-objects/user-id'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}
export interface RegisterResponse {
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = { token: string } | { message: string }

export interface GetUserDataRequest {
  userId: string
}

export type GetUserDataResponse =
  | {
      id: string
      email: string
      name: string
      role: string
      orders: Order[]
      addressess: Address[]
      createdAt: string
      updatedAt: string
    }
  | { message: string }

export interface CreateUserAddressRequest {
  userId: string | UserId
  street: string
  neighborhood: string
  city: string
  streetNumber: number
  complementNumber?: number
  zip: string
}
