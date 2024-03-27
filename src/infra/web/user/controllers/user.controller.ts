import { EmailAlreadyInUseError } from 'domain/user/errors/email-already-in-use-error'
import { CreateUserUsecase } from 'app/user/usecases/create-user/create-user.usecases'
import { UserRepository } from 'infra/account/prisma/repository/user.repository'
import {
  CreateUserRequest,
  GetUserDataRequest,
  GetUserDataResponse,
  LoginResponse,
} from './dtos/account-controller.dto'
import { LoginInput } from '@domain/user/repository/user.repository.interface'
import { WrongCredentialsError } from '@domain/user/errors/wrong-credentials-error'
import { LoginUseCase } from 'app/user/usecases/login/login.usecase'
import { container } from 'tsyringe'
import { UserNotFoundError } from '@domain/user/errors/user-not-found-error'
import { GetUserDataUsecase } from 'app/user/usecases/get-user-data/get-user-data'

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
      return token
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        return { message: error.message }
      }

      return { message: 'Error while trying login.' }
    }
  }

  public async getUserData(input: GetUserDataRequest): Promise<GetUserDataResponse> {
    const { userId } = input
    try {
      const usecase = new GetUserDataUsecase(new UserRepository())
      const user = await usecase.execute({ userId })
      return user
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return { message: error.message }
      }
      return { message: 'Error while trying get the user data.' }
    }
  }
}
