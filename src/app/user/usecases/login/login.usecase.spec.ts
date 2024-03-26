import { FakeUsersRepository } from '@domain/user/repository/fake/fake-user-repository'
import { LoginUseCase } from './login.usecase'
import { Encrypt } from '@domain/@shared/utils/encrypt'
import { User } from '@domain/user/entity/user'

describe('LoginUseCase unit tests', () => {
  let usersRepository: FakeUsersRepository
  let loginUsecase: LoginUseCase

  beforeEach(async () => {
    usersRepository = new FakeUsersRepository()
    loginUsecase = new LoginUseCase(usersRepository)
    const encryptedPassword = await Encrypt.encryptPassword('test')
    const user = User.create({
      name: 'bernardo',
      email: 'be@gmail.com',
      password: encryptedPassword,
      role: 'admin',
    })
    await usersRepository.create(user)
  })

  it('should login using email and password', async () => {
    const arrange = {
      email: 'be@gmail.com',
      password: 'test',
    }

    const { token } = await loginUsecase.execute(arrange)

    expect(token).toBeDefined()
  })
})
