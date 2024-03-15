import { Encrypt } from '../../../domain/@shared/utils/encrypt'
import { User } from '../../../domain/user/entity/user'
import { EmailAlreadyInUseError } from '../../../domain/user/errors/email-already-in-use-error'
import { IAccountRepository } from '../../../domain/user/repository/user.repository.interface'
import {
  ICreateUserUsecases,
  CreateUserUsecaseInput,
} from '../../../domain/user/usecases/createAccount.usecases.interface'

export class CreateUserUsecase implements ICreateUserUsecases {
  constructor(private readonly accountRepository: IAccountRepository) {}
  async execute(input: CreateUserUsecaseInput): Promise<void> {
    const { name, email, password, role } = input

    const findUser = await this.accountRepository.findByEmail(email)
    if (findUser) throw new EmailAlreadyInUseError()

    const encryptedPassword = await Encrypt.encryptPassword(password)
    const user = User.create({
      name,
      email,
      password: encryptedPassword,
      role,
    })
    await this.accountRepository.create(user)
  }
}
