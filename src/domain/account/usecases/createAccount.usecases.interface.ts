import { AccountModel } from '../entity/account'
import { Address } from '../entity/address'

export interface ICreateAccountUsecases {
  execute(
    name: string,
    email: string,
    password: string,
    role: string,
    address?: Address[]
  ): Promise<AccountModel>
}
