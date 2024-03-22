import { FakeUsersRepository } from '@domain/user/repository/fake/fake-user-repository'
import { CreateUserUsecase } from './create-user.usecases'
import { Encrypt } from '@domain/@shared/utils/encrypt'

describe('RegisterUseCase unit tests', () => {
  let usersRepository: FakeUsersRepository
  let usecase: CreateUserUsecase

  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    usecase = new CreateUserUsecase(usersRepository)
  })

  it('should register a new user', async () => {
    const registerSpy = jest.spyOn(usersRepository, 'create')

    const arrange = {
      name: 'Bernardo',
      email: 'bernardo@gmail.com',
      password: 'test123',
      role: 'admin',
    }

    await usecase.execute(arrange)

    expect(registerSpy).toHaveBeenCalled()
  }, 100000)

  it('should encrypt users password', async () => {
    const createUserSpy = jest.spyOn(usersRepository, 'create')
    const encrypSpy = jest.spyOn(Encrypt, 'encryptPassword')

    const arrange = {
      name: 'Bernardo',
      email: 'bernardo@gmail.com',
      password: 'test123',
      role: 'admin',
    }

    await usecase.execute(arrange)

    expect(createUserSpy).toHaveBeenCalled()
    expect(encrypSpy).toHaveBeenCalled()
  }, 100000)
})
