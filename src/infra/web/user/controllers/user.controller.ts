import { EmailAlreadyInUseError } from '@domain/user/errors/email-already-in-use-error'
import { CreateUserUsecase } from 'app/user/usecases/create-user.usecases'
import { UserRepository } from 'infra/account/prisma/repository/user.repository'
import { CreateUserRequest } from './dtos/account-controller.dto'

export class UserController {
  public async create(input: CreateUserRequest) {
    const { email, password, name, role } = input
    try {
      const usecase = new CreateUserUsecase(new UserRepository())
      await usecase.execute({ name, email, password, role })
      return { message: 'User created successfully' }
    } catch (err) {
      console.log(err)
      if (err instanceof EmailAlreadyInUseError) {
        return { message: err.message }
      }

      return { message: 'Error while trying register a new user.' }
    }
  }
}
