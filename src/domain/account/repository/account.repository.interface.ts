import { AccountModel } from '../entity/account'
import { Address } from '../entity/address'

export interface IAccountRepository {
  create(name: string, email: string, password: string, role?: string): Promise<void>
  // findAll(): Promise<AccountModel[]>
  // findById(id: number): Promise<AccountModel>
  // update(id: number, account: AccountModel): Promise<AccountModel>
  // deleteById(id: number): Promise<void>
}
