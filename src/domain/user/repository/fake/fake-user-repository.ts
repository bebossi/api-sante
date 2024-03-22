import { User } from 'domain/user/entity/user'
import { IUserRepository } from 'domain/user/repository/user.repository.interface'

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
}

export { FakeUsersRepository }
