import { AccountModel } from '../entity/account'

export interface IGetAccountUsecases {
  execute(id: number): Promise<AccountModel>
}
