import { AccountModel } from '../entity/account'

export type dataUpdateAccount = {
  name?: string
  email?: string
  password?: string
}

export interface IUpdateAccountUsecases {
  execute(id: number, account: dataUpdateAccount): Promise<AccountModel>
}
