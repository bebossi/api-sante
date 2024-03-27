import { Order } from '@domain/order/entity/order'
import Address from '@domain/user/entity/address'

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
