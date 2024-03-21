import { Encrypt } from '../../../domain/@shared/utils/encrypt'
import { User } from '../../../domain/user/entity/user'
import { EmailAlreadyInUseError } from '../../../domain/user/errors/email-already-in-use-error'
import { IUserRepository } from '../../../domain/user/repository/user.repository.interface'

export interface CreateUserUsecaseInput {
  name: string
  email: string
  password: string
  role: string
}

export interface ICreateUserUsecases {
  execute(input: CreateUserUsecaseInput): Promise<void>
}

export class CreateUserUsecase implements ICreateUserUsecases {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(input: CreateUserUsecaseInput): Promise<void> {
    const { name, email, password, role } = input

    const findUser = await this.userRepository.findByEmail(email)
    if (findUser) throw new EmailAlreadyInUseError()

    const encryptedPassword = await Encrypt.encryptPassword(password)

    const user = User.create({
      name,
      email,
      password: encryptedPassword,
      role,
    })
    await this.userRepository.create(user)
  }
}
