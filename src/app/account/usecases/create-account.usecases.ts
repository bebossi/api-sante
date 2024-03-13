import { IAccountRepository } from '../../../domain/account/repository/account.repository.interface'
import {
  CreateAccountUsecaseInput,
  ICreateAccountUsecases,
} from '../../../domain/account/usecases/createAccount.usecases.interface'

export class CreateAccountUsecase implements ICreateAccountUsecases {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(input: CreateAccountUsecaseInput): Promise<void> {
    const { name, email, password } = input
    this.accountRepository.create(name, email, password)
  }
}
