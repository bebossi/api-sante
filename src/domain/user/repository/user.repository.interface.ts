import { User } from 'domain/user/entity/user'
import { UserId } from '../value-objects/user-id'
import Address from '../entity/address'
export interface LoginInput {
  email: string
  password: string
}
export interface IUserRepository {
  create(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
  login(input: LoginInput): Promise<boolean>
  findById(id: string | UserId): Promise<User | null>
  createAddress(Address: Address): Promise<void>
}
