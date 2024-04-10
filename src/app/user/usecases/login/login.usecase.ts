import { Encrypt } from '@domain/@shared/utils/encrypt'
import { injectable, inject } from 'tsyringe'
import jwt from 'jsonwebtoken'
import { IUserRepository } from '@domain/user/repository/user.repository.interface'
import { WrongCredentialsError } from '@domain/user/errors/wrong-credentials-error'
import { UserNotFoundError } from '@domain/user/errors/user-not-found-error'

interface LoginUseCaseInput {
  email: string
  password: string
}

interface LoginUseCaseOutput {
  token: string
}

@injectable()
class LoginUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  public async execute({
    email,
    password,
  }: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new UserNotFoundError()

    const isValidPassword = await Encrypt.compare(password, user?.password as string)

    if (!isValidPassword) throw new WrongCredentialsError()

    await this.userRepository.login({
      email,
      password,
    })

    const token = jwt.sign(
      {
        id: user.id.value,
        role: user.role,
      },
      process.env.TOKEN_SIGN_SECRET || ('iewjfbhewkjfbewjhb' as string),
      {
        expiresIn: '24h',
        subject: user.id.value,
      }
    )
    return { token: token }
  }
}

export { LoginUseCase }
