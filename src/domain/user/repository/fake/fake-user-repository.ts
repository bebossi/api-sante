import { User } from 'domain/user/entity/user'
import {
  IUserRepository,
  LoginInput,
} from 'domain/user/repository/user.repository.interface'

class FakeUsersRepository implements IUserRepository {
  public users: User[]

  constructor() {
    this.users = []
  }

  async create(input: User): Promise<void> {
    this.users.push(input)
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)
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
}

export { FakeUsersRepository }
