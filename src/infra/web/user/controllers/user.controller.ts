import { EmailAlreadyInUseError } from 'domain/user/errors/email-already-in-use-error'
import { CreateUserUsecase } from 'app/user/usecases/create-user/create-user.usecases'
import { UserRepository } from 'infra/account/prisma/repository/user.repository'
import { CreateUserRequest, LoginResponse } from './dtos/account-controller.dto'
import { LoginInput } from '@domain/user/repository/user.repository.interface'
import { WrongCredentialsError } from '@domain/user/errors/wrong-credentials-error'
import { LoginUseCase } from 'app/user/usecases/login/login.usecase'
import { container } from 'tsyringe'

export class UserController {
  public async create(input: CreateUserRequest) {
    const { email, password, name, role } = input
    try {
      const createUserUsecase = new CreateUserUsecase(new UserRepository())
      // const createUserUsecase = container.resolve(CreateUserUsecase)
      await createUserUsecase.execute({ name, email, password, role })

      return { message: 'User created successfully' }
    } catch (err) {
      console.log(err)
      if (err instanceof EmailAlreadyInUseError) {
        return { message: err.message }
      }

      return { message: 'Error while trying register a new user.' }
    }
  }

  public async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input
    try {
      const usecase = new LoginUseCase(new UserRepository())
      const token = await usecase.execute({ email, password })
      console.log('controller', token)
      return token
    } catch (error) {
      console.log('error', error)
      if (error instanceof WrongCredentialsError) {
        return { message: error.message }
      }

      return { message: 'Error while trying login.' }
    }
  }
}
