import { User } from '../entity/user'

export interface IAccountRepository {
  create(user: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
}
