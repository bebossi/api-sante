import Address from '@domain/user/entity/address'
import { UserId } from '@domain/user/value-objects/user-id'
import { User } from 'domain/user/entity/user'

import {
  IUserRepository,
  LoginInput,
} from 'domain/user/repository/user.repository.interface'

class FakeUsersRepository implements IUserRepository {
  public users: User[]
  public addressess: Address[]

  constructor() {
    this.users = []
    this.addressess = []
  }
  async create(input: User): Promise<void> {
    this.users.push(input)
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)
    if (!user) return null
    return user
  }

  async findById(userId: string | UserId): Promise<User | null> {
    let id: UserId
    if (!(userId instanceof UserId)) {
      id = new UserId(userId)
    }
    const user = this.users.find((user) => {
      return user.id.equals(id)
    })

    if (!user) return null
    return user
  }

  async login({ email, password }: LoginInput): Promise<boolean> {
    const isValidLogin = this.users.find(
      (item) => item.email === email && item.password === password
    )

    if (isValidLogin) {
      return true
    }

    return false
  }

  async createAddress(input: Address): Promise<void> {
    let user = await this.findById(input.userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user!._props.addressess) {
      user!._props.addressess = []
    }

    user!._props.addressess.push(input)

    this.addressess.push(input)
  }
}

export { FakeUsersRepository }
