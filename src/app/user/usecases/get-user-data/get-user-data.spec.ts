import { User } from '@domain/user/entity/user'
import { FakeUsersRepository } from '@domain/user/repository/fake/fake-user-repository'
import { GetUserDataUsecase } from './get-user-data'

describe('GetUserDataUsecase unit tests', () => {
  let usersRepository: FakeUsersRepository
  let getUserDataUsecase: GetUserDataUsecase

  const user = User.create({
    name: 'bernardo',
    email: 'be@gmail.com',
    password: 'test',
    role: 'admin',
  })
  beforeEach(async () => {
    usersRepository = new FakeUsersRepository()
    getUserDataUsecase = new GetUserDataUsecase(usersRepository)
    await usersRepository.create(user)
  })

  it('should be able get users data', async () => {
    const arrange = {
      userId: user.id.value,
    }

    const result = await getUserDataUsecase.execute(arrange)

    expect(result).toEqual({
      id: user.id.value,
      name: user.name,
      email: user.email,
      role: user.role,
      orders: user.orders,
      addressess: user.addressess,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })
})
