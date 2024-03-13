import { CreateAccountUsecase } from '../../../app/account/usecases/create-account.usecases'
import { AccountRepository } from '../repository/account.repository'
import { CreateAccountRequest } from './dtos/account-controller.dto'
export default class AccountController {
  public async create(input: CreateAccountRequest) {
    const { email, password, name } = input
    try {
      const usecase = new CreateAccountUsecase(new AccountRepository())
      await usecase.execute({ name, email, password })
    } catch (err) {
      console.log(err)
    }
  }
}
